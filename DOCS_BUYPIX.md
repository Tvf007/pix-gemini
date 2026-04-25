# Documentação Técnica API BuyPix (Resumo para Integração)

## 1. Configurações Base
- **Base URL:** `https://buypix.me/api/v1`
- **Autenticação:**
  - Header: `Authorization: Bearer <API_KEY>`
  - Ou Header: `X-API-Key: <API_KEY>`
- **Idempotência:** Header `X-Idempotency-Key: <UUID_V4>` (Obrigatório em `POST /deposits` e `POST /withdrawals`).
- **Rate Limit:** 1.000 requisições por hora.

## 2. Endpoints Principais

### Depósitos (Receber PIX)
- `POST /deposits`: Cria um QR Code PIX. Requer `amount`, `description` e opcionalmente `payer_ip`.
- `GET /deposits/{id}`: Consulta status (pending, depix_sent, refunded, etc.).

### Saques (Enviar PIX via DePix)
- `POST /withdrawals`: Inicia conversão DePix -> PIX. Retorna um `deposit_address`.
- **Fluxo:** Criar saque -> Enviar DePix para o endereço -> Sistema envia PIX para a chave informada.

### Checkout e Links de Pagamento
- `POST /payment-links`: Cria links de checkout (valor fixo ou aberto).
- `POST /products`: Gerencia produtos para venda via link.

### Webhooks
- `POST /webhooks`: Cadastra URL de notificação.
- **Segurança:** O header `X-Webhook-Signature` deve ser validado usando HMAC-SHA256 com o `secret` do webhook.
- **Eventos:** `deposit.status.updated`, `withdrawal.status.updated`.

## 3. Estrutura de Resposta Padrão
```json
{
  "success": true,
  "message": "...",
  "data": { ... },
  "timestamp": "..."
}
```

## 4. Exemplos de Implementação (Referência)
A documentação original contém exemplos em:
- **cURL:** Uso básico de headers e JSON.
- **PHP:** Utilizando cURL nativo ou Guzzle.
- **Python:** Utilizando a biblioteca `requests`.
- **JavaScript:** Utilizando `fetch` ou `axios`.
