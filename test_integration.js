import crypto from 'crypto';

async function testIntegration() {
  const apiKey = 'bpx_LSKftVvEGaVzlH5yR2BXX17mahh2PEdHG3GV75dl';
  const amount = 5.00;
  
  console.log('--- Iniciando Teste de Integração BuyPix ---');
  console.log(`Tentando gerar PIX de R$ ${amount}...`);

  try {
    const response = await fetch('https://buypix.me/api/v1/deposits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Idempotency-Key': crypto.randomUUID()
      },
      body: JSON.stringify({
        amount: amount,
        description: 'Teste de Integração Gemini CLI'
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ SUCESSO!');
      console.log('ID do Depósito:', data.data.id);
      console.log('Status:', data.data.status);
      console.log('Dados completos:', JSON.stringify(data.data, null, 2));
      console.log('\nO terminal está pronto para uso!');
    } else {
      console.log('❌ FALHA NA API');
      console.log('Status Code:', response.status);
      console.log('Mensagem:', data.message || 'Sem mensagem de erro');
      if (data.errors) console.log('Erros:', data.errors);
    }
  } catch (error) {
    console.log('❌ ERRO DE CONEXÃO');
    console.error(error.message);
  }
}

testIntegration();
