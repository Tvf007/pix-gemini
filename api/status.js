export default async function handler(req, res) {
  const { id } = req.query;
  const apiKey = 'bpx_LSKftVvEGaVzlH5yR2BXX17mahh2PEdHG3GV75dl';

  try {
    let url = 'https://buypix.me/api/v1/deposits';
    if (id) {
      url += `/${id}`;
    } else {
      // Filtra por data de hoje (YYYY-MM-DD) para puxar itens do dia atual
      const today = new Date().toISOString().split('T')[0];
      url += `?date_from=${today}&per_page=50`;
    }

    const response = await fetch(url, {
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
