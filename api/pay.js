import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido' });
  }

  try {
    const { amount, description } = req.body;
    console.log('Recebendo requisição de pagamento:', { amount, description });

    const response = await fetch('https://buypix.me/api/v1/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BUYPIX_API_KEY}`,
        'X-Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify({
        amount: parseFloat(amount),
        description: description || 'Venda PDV Máquina',
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
