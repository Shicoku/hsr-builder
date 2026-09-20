const MIHOMO_API_BASE_URL = "https://api.mihomo.me/sr_info_parsed";
const UID_PATTERN = /^\d{9}$/;
const RATE_LIMIT_WINDOW_MS = 10_000;
const lastRequestAtByClient = new Map<string, number>();

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
  return clientIp || `user-agent:${request.headers.get("user-agent") ?? "unknown"}`;
}

export async function GET(request: Request, context: RouteContext<"/api/profile/[uid]">) {
  const { uid } = await context.params;

  if (!UID_PATTERN.test(uid)) {
    return Response.json({ error: "UIDは9桁の数字で入力してください。" }, { status: 400 });
  }

  const clientKey = getClientKey(request);
  const now = Date.now();
  const lastRequestAt = lastRequestAtByClient.get(clientKey);
  const remainingMs = lastRequestAt ? RATE_LIMIT_WINDOW_MS - (now - lastRequestAt) : 0;

  if (remainingMs > 0) {
    const retryAfterSeconds = Math.ceil(remainingMs / 1_000);
    return Response.json(
      {
        error: `連続して取得する場合は${retryAfterSeconds}秒お待ちください。`,
        retryAfterSeconds,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  lastRequestAtByClient.set(clientKey, now);

  try {
    const response = await fetch(`${MIHOMO_API_BASE_URL}/${encodeURIComponent(uid)}?lang=jp`, {
      cache: "no-store",
      headers: { "User-Agent": "hsr-builder/0.1" },
    });

    if (!response.ok) {
      const error = response.status === 404 ? "UIDが見つかりません。ゲーム内プロフィールが公開されているか確認してください。" : "現在情報を取得できません。しばらくしてからもう一度お試しください。";
      return Response.json({ error }, { status: response.status });
    }

    return Response.json({ data: await response.json() });
  } catch {
    return Response.json({ error: "情報の取得先に接続できませんでした。しばらくしてからもう一度お試しください。" }, { status: 502 });
  }
}
