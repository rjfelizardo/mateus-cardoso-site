// /api/notify-whatsapp.js
// Recebe os dados do formulário e dispara um aviso no WhatsApp via CallMeBot.
// Não faz nada (e não quebra o site) até as variáveis de ambiente serem configuradas.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;

  // Ainda não configurado — ignora silenciosamente.
  if (!phone || !apikey) {
    return res.status(200).json({ skipped: true });
  }

  const { nome, whatsapp, mensagem } = req.body || {};

  const text =
    'Novo pedido pelo site!\n' +
    'Nome: ' + (nome || '-') + '\n' +
    'WhatsApp: ' + (whatsapp || '-') + '\n' +
    'Mensagem: ' + (mensagem || '-');

  const url =
    'https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(phone) +
    '&text=' + encodeURIComponent(text) +
    '&apikey=' + encodeURIComponent(apikey);

  try {
    await fetch(url);
    return res.status(200).json({ sent: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send WhatsApp notification' });
  }
}
