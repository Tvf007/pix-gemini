export default async function handler(req, res) {
  const { method } = req;
  const apiKey = 'bpx_LSKftVvEGaVzlH5yR2BXX17mahh2PEdHG3GV75dl';

  if (method === 'POST') {
    // Criar Link de Pagamento
    try {
      const { amount, description } = req.body;
      const response = await fetch('https://buypix.me/api/v1/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          title: description || 'Venda via Link',
          amount: parseFloat(amount),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h expiração
        })
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  } else if (method === 'GET') {
    // Consultar Status do Link/Depósito para Comprovante
    const { id } = req.query;
    try {
      const response = await fetch(`https://buypix.me/api/v1/deposits/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
