import { sendEmail } from "@/lib/email/send-email";

export async function sendPasswordResetEmail({
  email,
  name,
  resetUrl,
}: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  const safeName = name.trim() || "usuário";

  await sendEmail({
    to: email,
    subject: "Redefina sua senha no Fatec Financas",
    text: [
      `Olá, ${safeName}.`,
      "",
      "Recebemos um pedido para redefinir sua senha.",
      `Use este link para continuar: ${resetUrl}`,
      "",
      "Se voce nao solicitou a redefinicao, ignore este email.",
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
        <p style="font-size:14px;letter-spacing:0.12em;text-transform:uppercase;color:#64748b;margin:0 0 12px">Fatec Financas</p>
        <h1 style="font-size:28px;line-height:1.2;margin:0 0 16px">Redefina sua senha</h1>
        <p style="font-size:15px;line-height:1.7;margin:0 0 12px">Olá, ${safeName}.</p>
        <p style="font-size:15px;line-height:1.7;margin:0 0 24px">
          Recebemos um pedido para redefinir sua senha. O link abaixo expira em 30 minutos.
        </p>
        <p style="margin:0 0 24px">
          <a href="${resetUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:14px;font-weight:700">
            Redefinir senha
          </a>
        </p>
        <p style="font-size:14px;line-height:1.7;margin:0 0 8px;color:#475569">
          Se o botão não abrir, copie este endereço:
        </p>
        <p style="font-size:13px;line-height:1.7;word-break:break-all;color:#0f766e;margin:0 0 24px">
          ${resetUrl}
        </p>
        <p style="font-size:14px;line-height:1.7;margin:0;color:#475569">
          Se voce nao solicitou a redefinicao, ignore este email.
        </p>
      </div>
    `,
  });
}
