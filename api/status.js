export default async function handler(req, res) {
  const { id, date_from, date_to } = req.query;
  const apiKey = process.env.BUYPIX_API_KEY;

  try {
    let url = 'https://buypix.me/api/v1/deposits';
    if (id) {
      url += `/${id}`;
    } else {
      // Filtra por data
      const today = new Date().toISOString().split('T')[0];
      const from = date_from || today;
      url += `?date_from=${from}&per_page=100`;
      if (date_to) url += `&date_to=${date_to}`;
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
