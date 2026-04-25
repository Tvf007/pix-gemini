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

    const data = await response.json();
    
    // LOG CRÍTICO: Registra o JSON inteiro para diagnóstico da trava de 5h
    console.log(`[DEBUG BuyPix] Resposta Completa ID ${id}:`, JSON.stringify(data, null, 2));
    
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[DEBUG BuyPix] Erro na consulta:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
