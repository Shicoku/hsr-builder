import nodemailer from "nodemailer";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function valueOf(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "送信内容が正しくありません。" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "送信内容が正しくありません。" }, { status: 400 });
  }

  const { name, email, message } = body as Record<string, unknown>;
  const senderName = valueOf(name);
  const senderEmail = valueOf(email);
  const mailMessage = valueOf(message);

  if (!mailMessage || (senderEmail && !EMAIL_PATTERN.test(senderEmail))) {
    return Response.json({ error: "お問い合わせ内容とメールアドレスを正しく入力してください。" }, { status: 400 });
  }

  if (senderName.length > 100 || senderEmail.length > 254 || mailMessage.length > 5000) {
    return Response.json({ error: "入力内容が長すぎます。" }, { status: 400 });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!gmailUser || !gmailAppPassword || !to) {
    return Response.json({ error: "お問い合わせ機能は現在準備中です。" }, { status: 503 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to,
      ...(senderEmail ? { replyTo: senderEmail } : {}),
      subject: "[ビルドカード] お問い合わせ",
      text: `お名前: ${senderName || "（未入力）"}\nメールアドレス: ${senderEmail || "（未入力）"}\n\n${mailMessage}`,
    });
  } catch (error) {
    console.error("[Contact mail error]", error);
    return Response.json({ error: "送信できませんでした。時間をおいて再度お試しください。" }, { status: 502 });
  }

  return Response.json({ message: "お問い合わせを送信しました。" });
}
