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
    
    // DIAGNÓSTICO TOTAL: Este log aparecerá na Vercel com todos os detalhes da BuyPix
    console.log(`[DIAGNOSTICO] Resposta bruta da API para o ID ${id}:`, JSON.stringify(data, null, 2));
    
    // Verifica se há metadados de webhook ou eventos específicos no objeto
    if (data.data && data.data.event) {
        console.log(`[DIAGNOSTICO] Evento detectado: ${data.data.event}`);
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[DIAGNOSTICO] Falha na consulta de status:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
