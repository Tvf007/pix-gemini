export default async function handler(req, res) {
  try {
    const response = await fetch('https://buypix.me/api/v1/reports/summary', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer bpx_LSKftVvEGaVzlH5yR2BXX17mahh2PEdHG3GV75dl'
      }
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
