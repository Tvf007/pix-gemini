export default async function handler(req, res) {
  const { id } = req.query;
  const apiKey = 'bpx_LSKftVvEGaVzlH5yR2BXX17mahh2PEdHG3GV75dl';

  try {
    let url = 'https://buypix.me/api/v1/deposits';
    if (id) {
      url += `/${id}`;
    } else {
      url += '?per_page=10'; // Busca as 10 últimas se não houver ID
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
