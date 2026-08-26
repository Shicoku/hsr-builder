import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  await resend.emails.send({
    from: "no-reply@example.com",
    to: "shicoku07@gmail.com",
    subject: `お問い合わせ: ビルドカード`,
    text: `
名前: ${name}
メール: ${email}
内容:
${message}
    `,
  });

  return Response.json({ ok: true });
}
