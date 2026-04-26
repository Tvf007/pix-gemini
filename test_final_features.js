async function testNewFeatures() {
  const apiKey = 'bpx_LSKftVvEGaVzlH5yR2BXX17mahh2PEdHG3GV75dl';
  
  console.log('--- Testando Novo Endpoint de Links de Pagamento ---');
  
  try {
    const response = await fetch('https://buypix.me/api/v1/payment-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        title: 'Teste de Link Compartilhável',
        amount: 50.00,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ SUCESSO: Link de Pagamento Gerado!');
      console.log('URL de Checkout:', data.data.checkout_url);
      console.log('ID da Transação:', data.data.id);
      console.log('\n--- Testando Consulta de Comprovante ---');
      
      // Simula a consulta usando o ID recém gerado
      const checkRes = await fetch(`https://buypix.me/api/v1/deposits/${data.data.id}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      const checkData = await checkRes.json();
      
      if (checkRes.ok) {
        console.log('✅ SUCESSO: Consulta de status operando!');
        console.log('Status atual:', checkData.data.status);
      }
    } else {
      console.log('❌ FALHA:', data.message || 'Erro desconhecido');
    }
  } catch (error) {
    console.error('❌ ERRO DE CONEXÃO:', error.message);
  }
}

testNewFeatures();
