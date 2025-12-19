import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Segurança: Aceitar apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nome, email, mensagem, token } = req.body;

  // === 2. VALIDAÇÃO DE CAMPOS ===
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  // === 3. VALIDAÇÃO RIGOROSA DO CLOUDFLARE ===
  if (!token) {
    return res.status(400).json({ message: 'Erro no Captcha. Atualize a página.' });
  }

  // Verifica se a chave secreta existe antes de tentar validar
  const secretKey = process.env.CLOUDFLARE_SECRET || process.env.TURNSTILE_SECRET;
  
  if (!secretKey) {
    console.error('ERRO CRÍTICO: Variável CLOUDFLARE_SECRET não configurada na Vercel.');
    return res.status(500).json({ message: 'Erro interno de configuração de segurança.' });
  }

  try {
    const cfVerify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const cfData = await cfVerify.json();

    // BLOQUEIO REAL: Se o Cloudflare não der OK, a gente rejeita.
    if (!cfData.success) {
      console.warn('Tentativa de spam bloqueada:', cfData);
      return res.status(403).json({ message: 'Verificação de segurança falhou. Acesso negado.' });
    }

  } catch (error) {
    // FAIL CLOSED: Se der erro na API do Cloudflare, NINGUÉM envia email.
    console.error('Erro ao conectar com Cloudflare:', error);
    return res.status(500).json({ message: 'Erro ao validar segurança. Tente novamente mais tarde.' });
  }

  // === 4. ENVIO DO EMAIL (UOL HOST / GMAIL) ===
  // Detecta se é UOL (porta 587) ou Gmail (465)
  const isSecure = Number(process.env.EMAIL_PORT) === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: isSecure, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Correção para UOL Host (Evita erro de certificado)
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: `"${nome}" <${process.env.EMAIL_USER}>`, // O remetente TEM que ser seu email autenticado
      to: process.env.EMAIL_DESTINO || process.env.EMAIL_USER,
      replyTo: email, // Quando você clicar em responder, vai para o cliente
      subject: `[Portfolio] Contato de ${nome}`,
      text: `Nome: ${nome}\nEmail: ${email}\n\nMensagem:\n${mensagem}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #007bff;">Novo Contato</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr>
          <p>${mensagem.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro SMTP:', error);
    return res.status(500).json({ message: 'Erro ao enviar email.' });
  }
}