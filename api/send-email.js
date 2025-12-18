import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Segurança: Aceitar apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nome, email, mensagem, token } = req.body;

  // === 1. VALIDAÇÃO DE CAMPOS (Humano) ===
  
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  if (mensagem.length < 20) {
    return res.status(400).json({ message: 'Sua mensagem é muito curta. Por favor, detalhe melhor o assunto.' });
  }

  // === 2. VALIDAÇÃO DE SEGURANÇA (Cloudflare Turnstile) ===
  
  if (!token) {
    return res.status(400).json({ message: 'Erro de segurança. Recarregue a página e tente novamente.' });
  }

  try {
    const cfVerify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.CLOUDFLARE_SECRET,
        response: token,
      }),
    });

    const cfData = await cfVerify.json();

    // Se o Cloudflare respondeu e disse que é ROBÔ, a gente bloqueia.
    if (!cfData.success) {
      return res.status(403).json({ message: 'Falha na verificação de segurança (Captcha). Você é um robô?' });
    }

  } catch (error) {
    // Se der erro de rede (Cloudflare caiu, timeout, etc), apenas avisamos no log
    console.error('ALERTA: Cloudflare indisponível ou erro de conexão. Permitindo envio por Fail-Open.', error);
  }

  // === 3. ENVIO DO EMAIL ===

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${nome}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_DESTINO,
      replyTo: email,
      subject: `[Portfolio] Contato de ${nome}`,
      text: `
        Nome: ${nome}
        Email: ${email}
        
        Mensagem:
        ${mensagem}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; color: #333;">
          <h2 style="color: #1ab7d2;">Novo Contato via Portfólio</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensagem:</strong></p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #1ab7d2;">
            ${mensagem.replace(/\n/g, '<br>')}
          </div>
          <p style="font-size: 12px; color: #999; margin-top: 20px;">
            Enviado via formulário seguro do site.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro SMTP:', error);
    return res.status(500).json({ message: 'Erro interno ao enviar email.' });
  }
}