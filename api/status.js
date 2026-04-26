export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID do depósito é obrigatório' });
  }

  try {
    const response = await fetch(`https://buypix.me/api/v1/deposits/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer bpx_LSKftVvEGaVzlH5yR2BXX17mahh2PEdHG3GV75dl'
      }
    });

    const result = await response.json();
    
    // Log para debug no painel da Vercel
    console.log(`[POLLING DEBUG] ID: ${id} | Status retornado: ${result.data?.status}`);
    
    return res.status(response.status).json(result);
  } catch (error) {
    console.error('[POLLING ERROR]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
