const nodemailer = require("nodemailer");

function isSmtpConfigured() {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendVerificationEmail(toEmail, verifyUrl) {
  // Modo prueba: sin SMTP configurado, solo mostrar link en consola
  if (!isSmtpConfigured()) {
    console.log("========================================");
    console.log("MODO PRUEBA - correo NO enviado (falta SMTP_USER/SMTP_PASS en .env)");
    console.log("Para:", toEmail);
    console.log("Link de verificación:", verifyUrl);
    console.log("========================================");
    return { mocked: true, verifyUrl };
  }

  const transporter = buildTransporter();

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await transporter.sendMail({
    from,
    to: toEmail,
    subject: "Confirma tu cuenta en ExamenDone",
    text: `Gracias por registrarte en ExamenDone.\n\nConfirma tu cuenta entrando a:\n${verifyUrl}\n\nSi no creaste esta cuenta, ignora este correo.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px;">
        <h2 style="color: #005A9C;">Bienvenido a ExamenDone</h2>
        <p>Gracias por registrarte. Haz clic en el botón para confirmar tu correo:</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#764ba2;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Confirmar mi cuenta</a>
        <p style="margin-top:16px;color:#666;font-size:13px;">Si el botón no funciona, copia este enlace:<br/>${verifyUrl}</p>
      </div>
    `,
  });

  return { mocked: false };
}

module.exports = { sendVerificationEmail, isSmtpConfigured };
