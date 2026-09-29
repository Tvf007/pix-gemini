export default async function handler(req, res) {
  try {
    const response = await fetch('https://buypix.me/api/v1/reports/summary', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.BUYPIX_API_KEY}`
      }
    });

    const data = await response.json();
    console.log('[BuyPix] Resumo Financeiro carregado');
    
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
