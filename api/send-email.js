import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // 1. Segurança: Aceitar apenas método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { nome, email, mensagem } = req.body;

  // 2. Validação básica no Backend
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

// 3. Configuração do Transporte (SMTP Profissional)
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
    // 4. Envio do Email
    await transporter.sendMail({
      from: `"${nome}" <${process.env.EMAIL_USER}>`, 
      to: process.env.EMAIL_DESTINO, 
      replyTo: email,
      subject: `Nova mensagem do Portfólio: ${nome}`,
      text: `
        Nome: ${nome}
        Email: ${email}
        Mensagem:
        ${mensagem}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ccc; border-radius: 10px;">
          <h2>Novo Contato do Site</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Mensagem:</strong></p>
          <p style="background: #f9f9f9; padding: 15px;">${mensagem.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return res.status(500).json({ message: 'Erro interno ao enviar email.' });
  }
}