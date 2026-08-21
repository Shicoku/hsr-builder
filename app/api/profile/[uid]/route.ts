const MIHOMO_API_BASE_URL = "https://api.mihomo.me/sr_info_parsed";
const UID_PATTERN = /^\d{9}$/;

export async function GET(
  _request: Request,
  context: RouteContext<"/api/profile/[uid]">,
) {
  const { uid } = await context.params;

  if (!UID_PATTERN.test(uid)) {
    return Response.json({ error: "UIDは9桁の数字で入力してください。" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${MIHOMO_API_BASE_URL}/${encodeURIComponent(uid)}?lang=jp`,
      {
        cache: "no-store",
        headers: { "User-Agent": "hsr-builder/0.1" },
      },
    );

    if (!response.ok) {
      const error = response.status === 404
        ? "UIDが見つかりません。ゲーム内プロフィールが公開されているか確認してください。"
        : "現在情報を取得できません。しばらくしてからもう一度お試しください。";
      return Response.json({ error }, { status: response.status });
    }

    return Response.json({ data: await response.json() });
  } catch {
    return Response.json(
      { error: "情報の取得先に接続できませんでした。しばらくしてからもう一度お試しください。" },
      { status: 502 },
    );
  }
}