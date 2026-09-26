Title: Cached Content

Description: Fetched from cache

Source: https://docs.buypix.me/docs/llms-full.txt

---

# Claude Code
Source: https://docs.buypix.me/docs/ai-tools/claude-code

Como usar o Claude Code (Anthropic) para integrar com a API BuyPix.

## O que é o Claude Code?

[Claude Code](https://docs.anthropic.com/en/docs/claude-code) é um agente de programação da Anthropic que roda no terminal. Ele pode ler arquivos, executar comandos e gerar código completo.

## Passo a Passo

<Steps>
  <Step title="Criar arquivo CLAUDE.md no projeto">
    Crie um arquivo `CLAUDE.md` na raiz do seu projeto com o contexto da API:

    ```markdown theme={null}
    # BuyPix API Integration

    ## API Reference
    - Base URL: https://buypix.me/api/v1
    - Auth: Bearer token (bpx_live_xxx)
    - Docs completa: https://docs.buypix.me/docs/llms-full.txt

    ## Endpoints Principais
    - POST /deposits — Criar depósito PIX (retorna QR Code)
    - GET /deposits/{id} — Consultar depósito
    - POST /withdrawals — Criar saque (DePix → PIX)
    - POST /webhooks — Registrar webhook

    ## Webhooks
    - Assinatura: HMAC-SHA256 (header X-Webhook-Signature)
    - Secret: fornecido na criação do webhook (whsec_xxx)
    - Eventos: deposit.completed, deposit.under_review, deposit.canceled,
      deposit.refunded, deposit.delayed, withdrawal.completed

    ## Idempotência
    - Header: X-Idempotency-Key (UUID v4)
    - Válido por 24h
    ```
  </Step>

  <Step title="Pedir a integração">
    No terminal, execute o Claude Code e peça:

    ```bash theme={null}
    claude "Leia o CLAUDE.md e crie uma integração completa com a API BuyPix.
    Preciso de: service class, webhook controller e testes."
    ```
  </Step>
</Steps>

## Dica: Fetch direto da documentação

O Claude Code pode buscar a documentação diretamente:

```bash theme={null}
claude "Leia https://docs.buypix.me/docs/llms-full.txt e crie
um service PHP para criar depósitos PIX com a API BuyPix."
```


# Cursor
Source: https://docs.buypix.me/docs/ai-tools/cursor

Como usar o Cursor IDE para integrar com a API BuyPix usando IA.

## O que é o Cursor?

[Cursor](https://cursor.sh) é uma IDE baseada no VS Code com IA integrada (GPT-4, Claude). Ele pode ler documentação externa e gerar código de integração automaticamente.

## Passo a Passo

<Steps>
  <Step title="Adicionar documentação como contexto">
    No Cursor, abra o chat (Ctrl+L) e adicione a URL da documentação como contexto:

    ```
    @docs https://docs.buypix.me/docs/llms-full.txt
    ```

    Ou adicione via **Settings → Features → Docs → Add new doc**:

    * URL: `https://docs.buypix.me/docs`
  </Step>

  <Step title="Pedir para gerar código">
    No chat do Cursor, peça:

    ```
    Usando a API BuyPix, crie uma classe PHP/Laravel que:
    1. Cria depósitos PIX com idempotência
    2. Verifica status do depósito
    3. Recebe e valida webhooks com HMAC-SHA256
    ```
  </Step>

  <Step title="Usar regras do projeto">
    Crie um arquivo `.cursor/rules` no seu projeto com contexto da API:

    ```
    # BuyPix API
    - Base URL: https://buypix.me/api/v1
    - Auth: Bearer token (header Authorization)
    - Formato chave: bpx_live_xxxxx
    - Idempotência: header X-Idempotency-Key (UUID v4)
    - Webhooks: assinatura HMAC-SHA256 no header X-Webhook-Signature
    - Status depósito: pending, depix_sent, under_review, canceled, error, refunded, expired, pending_pix2fa, delayed
    - Docs: https://docs.buypix.me/docs/llms-full.txt
    ```
  </Step>
</Steps>

## Exemplo de Prompt

```
@BuyPix API Docs

Crie um controller Laravel que recebe webhooks da BuyPix.
Deve validar a assinatura HMAC-SHA256 e tratar os eventos:
- deposit.completed (liberar produto)
- deposit.under_review (marcar como pendente)
- deposit.refunded (estornar crédito)
```


# Integrações com IA
Source: https://docs.buypix.me/docs/ai-tools/overview

Use ferramentas de IA como Cursor, Claude Code e Windsurf para integrar com a API BuyPix mais rapidamente.

## Por que usar IA para integrar?

Ferramentas de IA modernas podem ler a documentação da API BuyPix e gerar código de integração automaticamente. Isso acelera o desenvolvimento e reduz erros.

## Ferramentas Suportadas

<CardGroup>
  <Card title="Cursor" icon="code" href="/ai-tools/cursor">
    IDE com IA integrada — cole a URL da documentação e peça para gerar código
  </Card>

  <Card title="Claude Code" icon="terminal" href="/ai-tools/claude-code">
    Agente de terminal da Anthropic — use com contexto da API
  </Card>

  <Card title="Windsurf" icon="wind" href="/ai-tools/windsurf">
    IDE com IA da Codeium — importe a documentação como contexto
  </Card>
</CardGroup>

## Arquivo llms.txt

O Mintlify gera automaticamente um arquivo `llms.txt` e `llms-full.txt` com toda a documentação em formato otimizado para LLMs.

Acesse:

* **Resumo**: `https://docs.buypix.me/docs/llms.txt`
* **Completo**: `https://docs.buypix.me/docs/llms-full.txt`

Esses arquivos podem ser usados diretamente como contexto em qualquer ferramenta de IA.

## Dica Rápida

Em qualquer ferramenta de IA, você pode colar este prompt para começar:

```
Leia a documentação completa da API BuyPix nesta URL: https://docs.buypix.me/docs/llms-full.txt
Salve todas as informações como contexto permanente e me ajude a integrar a API no meu projeto.
```


# Windsurf
Source: https://docs.buypix.me/docs/ai-tools/windsurf

Como usar o Windsurf IDE para integrar com a API BuyPix usando IA.

## O que é o Windsurf?

[Windsurf](https://codeium.com/windsurf) é uma IDE com IA da Codeium que oferece um assistente inteligente capaz de ler documentação e gerar código contextualizado.

## Passo a Passo

<Steps>
  <Step title="Adicionar documentação como contexto">
    No Windsurf, abra o Cascade (Ctrl+L) e adicione a documentação:

    ```
    @url https://docs.buypix.me/docs/llms-full.txt
    ```
  </Step>

  <Step title="Criar arquivo de regras">
    Crie `.windsurf/rules` na raiz do projeto:

    ```
    # BuyPix API Context
    - Base URL: https://buypix.me/api/v1
    - Auth: Bearer bpx_live_xxxxx
    - Idempotência: X-Idempotency-Key (UUID v4)
    - Webhooks: HMAC-SHA256 via X-Webhook-Signature
    - Status depósito: pending, depix_sent, under_review, canceled, error, refunded, expired, pending_pix2fa, delayed
    - Documentação: https://docs.buypix.me/docs/llms-full.txt
    ```
  </Step>

  <Step title="Pedir para gerar código">
    No Cascade:

    ```
    Usando a API BuyPix (docs em @url), crie:
    1. Um service class para criar depósitos e consultar status
    2. Um webhook handler com validação HMAC-SHA256
    3. Testes unitários para ambos
    ```
  </Step>
</Steps>

## Exemplo de Prompt

```
Com base na documentação da API BuyPix, crie um fluxo completo de
pagamento PIX no meu projeto Laravel:
- Criar depósito → exibir QR Code → receber webhook → liberar acesso
```


# Consultar Conta
Source: https://docs.buypix.me/docs/api-reference/account/get-account

GET https://buypix.me/api/v1/account
Retorna informações da conta autenticada, incluindo saldo, tier, taxas, limites e código de indicação.

## Resposta

<ResponseField name="success" type="boolean">
  Indica se a requisição foi bem-sucedida.
</ResponseField>

<ResponseField name="data" type="object">
  <Expandable title="Campos">
    <ResponseField name="id" type="integer">ID da conta</ResponseField>
    <ResponseField name="name" type="string">Nome da conta</ResponseField>
    <ResponseField name="email" type="string">E-mail da conta</ResponseField>
    <ResponseField name="balance" type="number">Saldo disponível em R$</ResponseField>     <ResponseField name="commission_balance" type="number">Saldo de comissões em R$</ResponseField>

    <ResponseField name="tier" type="object">
      Tier atual da conta com `name` e `max_amount`
    </ResponseField>

    <ResponseField name="fees" type="object">
      Taxas aplicáveis: `deposit_percent`, `deposit_fixed`, `withdrawal_percent`
    </ResponseField>

    <ResponseField name="limits" type="object">
      Limites: `min_amount`, `max_anonymous`, `daily_per_cpf`
    </ResponseField>

    <ResponseField name="referral_code" type="string">Código de indicação</ResponseField>
  </Expandable>
</ResponseField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET https://buypix.me/api/v1/account \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/account');
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/account', {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://buypix.me/api/v1/account',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Empresa XYZ",
      "email": "contato@empresa.com",
      "balance": 1500.50,
      "commission_balance": 25.00,
      "tier": { "name": "Prata", "max_amount": 50000 },
      "fees": {
        "deposit_percent": 2.0,
        "deposit_fixed": 0.99,
        "withdrawal_percent": 1.5
      },
      "limits": {
        "min_amount": 10,
        "max_anonymous": 500,
        "daily_per_cpf": 5000
      },
      "referral_code": "ABC123"
    }
  }
  ```
</ResponseExample>


# Criar Depósito
Source: https://docs.buypix.me/docs/api-reference/deposits/create-deposit

POST https://buypix.me/api/v1/deposits
Cria um novo depósito e retorna o QR Code PIX para pagamento.

## Parâmetros

<ParamField type="number">
  Valor em R\$ (mínimo: 5)
</ParamField>

<ParamField type="string">
  Obrigatório. CPF/CNPJ de quem irá fazer o pagamento, titular da conta pagadora. Use 11 dígitos para CPF ou 14 dígitos para CNPJ.
</ParamField>

<ParamField type="string">
  Nome do pagador. Recomendado quando enviar `payer_document`.
</ParamField>

<ParamField type="string">
  ID interno Eulen do pagador final, se você já possuir esse identificador. Opcional; não substitui o `payer_document`.
</ParamField>

<ParamField type="boolean">
  Compatibilidade legada. A identificação do pagador final continua recomendada para evitar recusas/devoluções.
</ParamField>

<ParamField type="string">
  URL para receber callbacks de status deste depósito (ad-hoc webhook). Se fornecida, os eventos de status serão enviados para esta URL **além** dos endpoints de webhook cadastrados. Útil para integrações que precisam de callbacks por transação sem cadastrar endpoints fixos.
</ParamField>

<ParamField type="string">
  IP real do cliente/pagador (IPv4 ou IPv6). **Recomendado para integrações server-to-server** — permite geolocalização correta nos relatórios de pagamentos por estado. Se omitido, será usado o IP da requisição (que em chamadas server-to-server será o IP do seu servidor, não do cliente).
</ParamField>

## Identificação do recebedor e do pagador

Ao criar um depósito via API, existem duas identificações diferentes:

* **Recebedor DePix:** identificado automaticamente pela API Key usada na requisição. Se a conta BuyPix já passou pela validação interna da Eulen, a BuyPix envia automaticamente o ID interno dessa conta para a Eulen. Você não precisa enviar `merchantId`.
* **Pagador final:** deve ser informado obrigatoriamente por `payer_document`, com o CPF ou CNPJ do titular da conta que fará o pagamento. Se sua integração também tiver `payer_euid`, envie como complemento.

Resumo: **API Key = recebedor/merchant BuyPix**; **payer\_document = cliente pagador obrigatório**.

Se `payer_document` não for enviado, ou se não tiver 11/14 dígitos, a API retorna erro de validação antes de criar o QR Code.

## Headers opcionais

<ParamField type="string">
  UUID único para prevenir duplicidade. Válido por 24h.
</ParamField>

## Status do Depósito

| Status           | Descrição                             |
| ---------------- | ------------------------------------- |
| `pending`        | Aguardando pagamento PIX              |
| `depix_sent`     | PIX recebido, DePix enviado           |
| `under_review`   | Em análise/revisão pela equipe        |
| `canceled`       | Cancelado                             |
| `error`          | Erro no processamento                 |
| `refunded`       | Reembolsado (valor devolvido via PIX) |
| `expired`        | QR Code expirado                      |
| `pending_pix2fa` | Aguardando verificação Pix 2FA        |
| `delayed`        | Processamento atrasado                |

<RequestExample>
  ```bash cURL theme={null}
  curl -X POST https://buypix.me/api/v1/deposits \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -H "X-Idempotency-Key: uuid-unico" \
    -d '{"amount": 100.00, "payer_document": "12345678900", "payer_name": "Cliente Teste", "webhook_url": "https://meu-site.com/callback", "payer_ip": "200.185.212.74"}'
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/deposits');
  curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
          'Content-Type: application/json',
          'X-Idempotency-Key: ' . uniqid(),
      ],
      CURLOPT_POSTFIELDS => json_encode([
          'amount' => 100.00,
          'payer_document' => '12345678900',
          'payer_name' => 'Cliente Teste',
          'webhook_url' => 'https://meu-site.com/callback',
          'payer_ip' => $_SERVER['REMOTE_ADDR'], // IP real do cliente
      ]),
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/deposits', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer bpx_live_sua_chave',
      'Content-Type': 'application/json',
      'X-Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      amount: 100.00,
      payer_document: '12345678900',
      payer_name: 'Cliente Teste',
      webhook_url: 'https://meu-site.com/callback',
      payer_ip: clientIp,
    }),
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      'https://buypix.me/api/v1/deposits',
      headers={
          'Authorization': 'Bearer bpx_live_sua_chave',
          'X-Idempotency-Key': 'uuid-unico',
      },
      json={
          'amount': 100.00,
          'payer_document': '12345678900',
          'payer_name': 'Cliente Teste',
          'webhook_url': 'https://meu-site.com/callback',
          'payer_ip': client_ip,
      },
  )
  data = response.json()
  ```

  ```bash cURL usando payer_euid theme={null}
  curl -X POST https://buypix.me/api/v1/deposits \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -H "X-Idempotency-Key: uuid-unico" \
    -d '{"amount": 100.00, "payer_document": "12345678900", "payer_euid": "EU012345678901234", "webhook_url": "https://meu-site.com/callback", "payer_ip": "200.185.212.74"}'
  ```
</RequestExample>

<ResponseExample>
  ```json 201 theme={null}
  {
    "success": true,
    "message": "Depósito criado com sucesso.",
    "data": {
      "id": "uuid-do-deposito",
      "amount": 100.00,
      "fee_percent": 2.0,
      "fee_amount": 2.00,
      "net_amount": 98.00,
      "status": "pending",
      "pix_qr_code": "00020126...",
      "pix_qr_code_base64": "data:image/png;base64,...",
      "expires_at": "2026-02-20T12:30:00Z"
    }
  }
  ```
</ResponseExample>


# Consultar Depósito
Source: https://docs.buypix.me/docs/api-reference/deposits/get-deposit

GET https://buypix.me/api/v1/deposits/{id}
Consulta detalhes de um depósito específico.

## Path Parameters

<ParamField type="string">
  UUID do depósito
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET https://buypix.me/api/v1/deposits/uuid-do-deposito \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $depositId = 'uuid-do-deposito';
  $ch = curl_init("https://buypix.me/api/v1/deposits/{$depositId}");
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const depositId = 'uuid-do-deposito';
  const response = await fetch(`https://buypix.me/api/v1/deposits/${depositId}`, {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  deposit_id = 'uuid-do-deposito'
  response = requests.get(
      f'https://buypix.me/api/v1/deposits/{deposit_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": {
      "id": "uuid-do-deposito",
      "amount": 100.00,
      "fee_percent": 2.0,
      "fee_amount": 2.00,
      "net_amount": 98.00,
      "status": "depix_sent",
      "pix_qr_code": "00020126...",
      "confirmed_at": "2026-02-20T12:05:00Z"
    }
  }
  ```
</ResponseExample>


# Listar Depósitos
Source: https://docs.buypix.me/docs/api-reference/deposits/list-deposits

GET https://buypix.me/api/v1/deposits
Lista depósitos com filtros e paginação.

## Query Parameters

<ParamField type="string">
  Filtrar por status: `pending`, `depix_sent`, `under_review`, `canceled`, `error`, `refunded`, `expired`, `pending_pix2fa`, `delayed`
</ParamField>

<ParamField type="string">
  Data início no formato `YYYY-MM-DD`
</ParamField>

<ParamField type="string">
  Data fim no formato `YYYY-MM-DD`
</ParamField>

<ParamField type="integer">
  Itens por página (1-100, padrão: 15)
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET "https://buypix.me/api/v1/deposits?status=pending&per_page=10" \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/deposits?status=pending&per_page=10');
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const params = new URLSearchParams({ status: 'pending', per_page: '10' });
  const response = await fetch(`https://buypix.me/api/v1/deposits?${params}`, {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://buypix.me/api/v1/deposits',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      params={'status': 'pending', 'per_page': 10},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "amount": 100.00,
        "status": "pending",
        "created_at": "2026-02-20T12:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 5,
      "per_page": 10,
      "total": 47
    }
  }
  ```
</ResponseExample>


# Visão Geral da API
Source: https://docs.buypix.me/docs/api-reference/overview

Todos os endpoints disponíveis na API BuyPix v1

## Base URL

```
https://buypix.me/api/v1
```

## Endpoints Disponíveis

### Conta

| Método | Endpoint   | Descrição                           |
| ------ | ---------- | ----------------------------------- |
| `GET`  | `/account` | Informações da conta, saldo e taxas |

### Depósitos (PIX → DePix)

| Método | Endpoint         | Descrição           |
| ------ | ---------------- | ------------------- |
| `POST` | `/deposits`      | Criar novo depósito |
| `GET`  | `/deposits`      | Listar depósitos    |
| `GET`  | `/deposits/{id}` | Consultar depósito  |

### Saques (DePix → PIX)

| Método | Endpoint            | Descrição        |
| ------ | ------------------- | ---------------- |
| `POST` | `/withdrawals`      | Criar novo saque |
| `GET`  | `/withdrawals`      | Listar saques    |
| `GET`  | `/withdrawals/{id}` | Consultar saque  |

### Links de Pagamento

| Método   | Endpoint              | Descrição      |
| -------- | --------------------- | -------------- |
| `GET`    | `/payment-links`      | Listar links   |
| `POST`   | `/payment-links`      | Criar link     |
| `GET`    | `/payment-links/{id}` | Consultar link |
| `PUT`    | `/payment-links/{id}` | Atualizar link |
| `DELETE` | `/payment-links/{id}` | Desativar link |

### Produtos

| Método   | Endpoint         | Descrição         |
| -------- | ---------------- | ----------------- |
| `GET`    | `/products`      | Listar produtos   |
| `POST`   | `/products`      | Criar produto     |
| `GET`    | `/products/{id}` | Consultar produto |
| `PUT`    | `/products/{id}` | Atualizar produto |
| `DELETE` | `/products/{id}` | Desativar produto |

### Relatórios

| Método | Endpoint           | Descrição         |
| ------ | ------------------ | ----------------- |
| `GET`  | `/reports/summary` | Resumo financeiro |

### Webhooks

| Método   | Endpoint         | Descrição          |
| -------- | ---------------- | ------------------ |
| `POST`   | `/webhooks`      | Registrar endpoint |
| `GET`    | `/webhooks`      | Listar endpoints   |
| `DELETE` | `/webhooks/{id}` | Remover endpoint   |


# Criar Link de Pagamento
Source: https://docs.buypix.me/docs/api-reference/payment-links/create-payment-link

POST https://buypix.me/api/v1/payment-links
Cria um novo link de pagamento e retorna a URL de checkout.

## Parâmetros

<ParamField type="string">
  Título do link
</ParamField>

<ParamField type="string">
  Descrição (máx: 500 caracteres)
</ParamField>

<ParamField type="number">
  Valor fixo em R\$ (mín: 10). Deixe vazio para valor aberto.
</ParamField>

<ParamField type="string">
  Slug personalizado para a URL. Vazio = gerado automaticamente.
</ParamField>

<ParamField type="boolean">
  Exigir dados do pagador no checkout
</ParamField>

<ParamField type="boolean">
  Repassar taxas ao pagador
</ParamField>

<ParamField type="string">
  Data de expiração no formato ISO 8601
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X POST https://buypix.me/api/v1/payment-links \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -d '{"title": "Pagamento Consultoria", "amount": 150.00}'
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/payment-links');
  curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
          'Content-Type: application/json',
      ],
      CURLOPT_POSTFIELDS => json_encode([
          'title' => 'Pagamento Consultoria',
          'amount' => 150.00,
      ]),
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/payment-links', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer bpx_live_sua_chave',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: 'Pagamento Consultoria', amount: 150.00 }),
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      'https://buypix.me/api/v1/payment-links',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      json={'title': 'Pagamento Consultoria', 'amount': 150.00},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 201 theme={null}
  {
    "success": true,
    "message": "Link de pagamento criado com sucesso.",
    "data": {
      "id": "uuid-do-link",
      "title": "Pagamento Consultoria",
      "slug": "xK3mN9pQ2w",
      "amount": 150.00,
      "is_active": true,
      "checkout_url": "https://buypix.me/pay/xK3mN9pQ2w",
      "description": null,
      "require_payer_data": false,
      "pass_fees_to_payer": false,
      "expires_at": null,
      "is_expired": false,
      "created_at": "2026-02-25T10:00:00Z",
      "updated_at": "2026-02-25T10:00:00Z"
    }
  }
  ```
</ResponseExample>


# Desativar Link de Pagamento
Source: https://docs.buypix.me/docs/api-reference/payment-links/delete-payment-link

DELETE https://buypix.me/api/v1/payment-links/{id}
Desativa um link de pagamento (soft delete).

## Path Parameters

<ParamField type="string">
  UUID do link de pagamento
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X DELETE https://buypix.me/api/v1/payment-links/uuid-do-link \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $linkId = 'uuid-do-link';
  $ch = curl_init("https://buypix.me/api/v1/payment-links/{$linkId}");
  curl_setopt_array($ch, [
      CURLOPT_CUSTOMREQUEST => 'DELETE',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const linkId = 'uuid-do-link';
  const response = await fetch(`https://buypix.me/api/v1/payment-links/${linkId}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  link_id = 'uuid-do-link'
  response = requests.delete(
      f'https://buypix.me/api/v1/payment-links/{link_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "message": "Link de pagamento desativado."
  }
  ```
</ResponseExample>


# Consultar Link de Pagamento
Source: https://docs.buypix.me/docs/api-reference/payment-links/get-payment-link

GET https://buypix.me/api/v1/payment-links/{id}
Consulta detalhes de um link de pagamento.

## Path Parameters

<ParamField type="string">
  UUID do link de pagamento
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET https://buypix.me/api/v1/payment-links/uuid-do-link \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $linkId = 'uuid-do-link';
  $ch = curl_init("https://buypix.me/api/v1/payment-links/{$linkId}");
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const linkId = 'uuid-do-link';
  const response = await fetch(`https://buypix.me/api/v1/payment-links/${linkId}`, {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  link_id = 'uuid-do-link'
  response = requests.get(
      f'https://buypix.me/api/v1/payment-links/{link_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": {
      "id": "uuid-do-link",
      "title": "Pagamento Consultoria",
      "slug": "xK3mN9pQ2w",
      "amount": 150.00,
      "is_active": true,
      "checkout_url": "https://buypix.me/pay/xK3mN9pQ2w",
      "description": "Pagamento referente à consultoria de marketing",
      "require_payer_data": false,
      "pass_fees_to_payer": false,
      "expires_at": null,
      "is_expired": false,
      "created_at": "2026-02-25T10:00:00Z",
      "updated_at": "2026-02-25T10:00:00Z"
    }
  }
  ```
</ResponseExample>


# Listar Links de Pagamento
Source: https://docs.buypix.me/docs/api-reference/payment-links/list-payment-links

GET https://buypix.me/api/v1/payment-links
Lista todos os links de pagamento da conta com paginação.

## Query Parameters

<ParamField type="boolean">
  Filtrar por status (`true` ou `false`)
</ParamField>

<ParamField type="integer">
  Itens por página (1-100, padrão: 15)
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET "https://buypix.me/api/v1/payment-links?is_active=true" \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/payment-links?is_active=true');
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/payment-links?is_active=true', {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://buypix.me/api/v1/payment-links',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      params={'is_active': 'true'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": [
      {
        "id": "uuid-do-link",
        "title": "Pagamento Consultoria",
        "slug": "abc123",
        "amount": 150.00,
        "is_active": true,
        "checkout_url": "https://buypix.me/pay/abc123",
        "created_at": "2026-02-25T10:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 15,
      "total": 1
    }
  }
  ```
</ResponseExample>


# Atualizar Link de Pagamento
Source: https://docs.buypix.me/docs/api-reference/payment-links/update-payment-link

PUT https://buypix.me/api/v1/payment-links/{id}
Atualiza um link de pagamento existente.

## Path Parameters

<ParamField type="string">
  UUID do link de pagamento
</ParamField>

## Parâmetros

<ParamField type="string">
  Novo título
</ParamField>

<ParamField type="number">
  Novo valor fixo em R\$
</ParamField>

<ParamField type="boolean">
  Ativar/desativar o link
</ParamField>

<ParamField type="boolean">
  Repassar taxas ao pagador
</ParamField>

<ParamField type="string">
  Nova data de expiração (ISO 8601)
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X PUT https://buypix.me/api/v1/payment-links/uuid-do-link \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -d '{"title": "Novo Título", "amount": 200.00}'
  ```

  ```php PHP theme={null}
  $linkId = 'uuid-do-link';
  $ch = curl_init("https://buypix.me/api/v1/payment-links/{$linkId}");
  curl_setopt_array($ch, [
      CURLOPT_CUSTOMREQUEST => 'PUT',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
          'Content-Type: application/json',
      ],
      CURLOPT_POSTFIELDS => json_encode([
          'title' => 'Novo Título',
          'amount' => 200.00,
      ]),
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const linkId = 'uuid-do-link';
  const response = await fetch(`https://buypix.me/api/v1/payment-links/${linkId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer bpx_live_sua_chave',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: 'Novo Título', amount: 200.00 }),
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  link_id = 'uuid-do-link'
  response = requests.put(
      f'https://buypix.me/api/v1/payment-links/{link_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      json={'title': 'Novo Título', 'amount': 200.00},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "message": "Link de pagamento atualizado.",
    "data": { "..." }
  }
  ```
</ResponseExample>


# Criar Produto
Source: https://docs.buypix.me/docs/api-reference/products/create-product

POST https://buypix.me/api/v1/products
Cria um novo produto e retorna a URL de checkout.

## Parâmetros

<ParamField type="string">
  Nome do produto
</ParamField>

<ParamField type="number">
  Preço em R\$ (mínimo: 10)
</ParamField>

<ParamField type="string">
  Descrição do produto (máx: 1000 caracteres)
</ParamField>

<ParamField type="string">
  Slug personalizado. Vazio = gerado automaticamente.
</ParamField>

<ParamField type="string">
  URL de redirecionamento após pagamento
</ParamField>

<ParamField type="string">
  URL para notificação de pagamento confirmado
</ParamField>

<ParamField type="string">
  Código do cupom de desconto
</ParamField>

<ParamField type="number">
  Porcentagem de desconto (1-100)
</ParamField>

<ParamField type="boolean">
  Repassar taxas ao comprador
</ParamField>

<ParamField type="boolean">
  Exibir campo nome no checkout
</ParamField>

<ParamField type="boolean">
  Exibir campo e-mail no checkout
</ParamField>

<ParamField type="boolean">
  Exibir campo telefone no checkout
</ParamField>

<ParamField type="boolean">
  Exibir campo CPF no checkout
</ParamField>

<ParamField type="string">
  ID do Facebook Pixel para tracking
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X POST https://buypix.me/api/v1/products \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -d '{"name": "Curso de Marketing", "price": 197.00, "webhook_url": "https://meu-site.com/webhook"}'
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/products');
  curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
          'Content-Type: application/json',
      ],
      CURLOPT_POSTFIELDS => json_encode([
          'name' => 'Curso de Marketing',
          'price' => 197.00,
          'webhook_url' => 'https://meu-site.com/webhook',
      ]),
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/products', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer bpx_live_sua_chave',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Curso de Marketing',
      price: 197.00,
      webhook_url: 'https://meu-site.com/webhook',
    }),
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      'https://buypix.me/api/v1/products',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      json={
          'name': 'Curso de Marketing',
          'price': 197.00,
          'webhook_url': 'https://meu-site.com/webhook',
      },
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 201 theme={null}
  {
    "success": true,
    "message": "Produto criado com sucesso.",
    "data": {
      "id": "uuid-do-produto",
      "name": "Curso de Marketing",
      "slug": "curso-de-marketing-xK3mN9",
      "price": 197.00,
      "is_active": true,
      "checkout_url": "https://buypix.me/checkout/curso-de-marketing-xK3mN9",
      "webhook_url": "https://meu-site.com/webhook",
      "created_at": "2026-02-25T10:00:00Z"
    }
  }
  ```
</ResponseExample>


# Desativar Produto
Source: https://docs.buypix.me/docs/api-reference/products/delete-product

DELETE https://buypix.me/api/v1/products/{id}
Desativa um produto (soft delete). O checkout ficará indisponível.

## Path Parameters

<ParamField type="string">
  UUID do produto
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X DELETE https://buypix.me/api/v1/products/uuid-do-produto \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $productId = 'uuid-do-produto';
  $ch = curl_init("https://buypix.me/api/v1/products/{$productId}");
  curl_setopt_array($ch, [
      CURLOPT_CUSTOMREQUEST => 'DELETE',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const productId = 'uuid-do-produto';
  const response = await fetch(`https://buypix.me/api/v1/products/${productId}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  product_id = 'uuid-do-produto'
  response = requests.delete(
      f'https://buypix.me/api/v1/products/{product_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "message": "Produto desativado."
  }
  ```
</ResponseExample>


# Consultar Produto
Source: https://docs.buypix.me/docs/api-reference/products/get-product

GET https://buypix.me/api/v1/products/{id}
Consulta detalhes de um produto.

## Path Parameters

<ParamField type="string">
  UUID do produto
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET https://buypix.me/api/v1/products/uuid-do-produto \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $productId = 'uuid-do-produto';
  $ch = curl_init("https://buypix.me/api/v1/products/{$productId}");
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const productId = 'uuid-do-produto';
  const response = await fetch(`https://buypix.me/api/v1/products/${productId}`, {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  product_id = 'uuid-do-produto'
  response = requests.get(
      f'https://buypix.me/api/v1/products/{product_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": {
      "id": "uuid-do-produto",
      "name": "Curso de Marketing",
      "slug": "curso-de-marketing-xK3mN9",
      "price": 197.00,
      "is_active": true,
      "checkout_url": "https://buypix.me/checkout/curso-de-marketing-xK3mN9",
      "description": "Curso completo de marketing digital",
      "webhook_url": "https://meu-site.com/webhook",
      "created_at": "2026-02-25T10:00:00Z",
      "updated_at": "2026-02-25T10:00:00Z"
    }
  }
  ```
</ResponseExample>


# Listar Produtos
Source: https://docs.buypix.me/docs/api-reference/products/list-products

GET https://buypix.me/api/v1/products
Lista todos os produtos da conta com paginação.

## Query Parameters

<ParamField type="boolean">
  Filtrar por status (`true` ou `false`)
</ParamField>

<ParamField type="integer">
  Itens por página (1-100, padrão: 15)
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET "https://buypix.me/api/v1/products?is_active=true" \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/products?is_active=true');
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/products?is_active=true', {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://buypix.me/api/v1/products',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      params={'is_active': 'true'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": [
      {
        "id": "uuid-do-produto",
        "name": "Curso de Marketing",
        "slug": "curso-de-marketing-xK3mN9",
        "price": 197.00,
        "is_active": true,
        "checkout_url": "https://buypix.me/checkout/curso-de-marketing-xK3mN9",
        "created_at": "2026-02-25T10:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 15,
      "total": 1
    }
  }
  ```
</ResponseExample>


# Atualizar Produto
Source: https://docs.buypix.me/docs/api-reference/products/update-product

PUT https://buypix.me/api/v1/products/{id}
Atualiza um produto existente.

## Path Parameters

<ParamField type="string">
  UUID do produto
</ParamField>

## Parâmetros

<ParamField type="string">
  Novo nome
</ParamField>

<ParamField type="number">
  Novo preço em R\$
</ParamField>

<ParamField type="boolean">
  Ativar/desativar
</ParamField>

<ParamField type="string">
  Nova URL de webhook
</ParamField>

<ParamField type="string">
  Novo código de cupom
</ParamField>

<ParamField type="number">
  Nova porcentagem de desconto (1-100)
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X PUT https://buypix.me/api/v1/products/uuid-do-produto \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -d '{"price": 247.00, "coupon_code": "PROMO20", "coupon_percentage": 20}'
  ```

  ```php PHP theme={null}
  $productId = 'uuid-do-produto';
  $ch = curl_init("https://buypix.me/api/v1/products/{$productId}");
  curl_setopt_array($ch, [
      CURLOPT_CUSTOMREQUEST => 'PUT',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
          'Content-Type: application/json',
      ],
      CURLOPT_POSTFIELDS => json_encode([
          'price' => 247.00,
          'coupon_code' => 'PROMO20',
          'coupon_percentage' => 20,
      ]),
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const productId = 'uuid-do-produto';
  const response = await fetch(`https://buypix.me/api/v1/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Authorization': 'Bearer bpx_live_sua_chave',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price: 247.00,
      coupon_code: 'PROMO20',
      coupon_percentage: 20,
    }),
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  product_id = 'uuid-do-produto'
  response = requests.put(
      f'https://buypix.me/api/v1/products/{product_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      json={
          'price': 247.00,
          'coupon_code': 'PROMO20',
          'coupon_percentage': 20,
      },
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "message": "Produto atualizado.",
    "data": { "..." }
  }
  ```
</ResponseExample>


# Resumo Financeiro
Source: https://docs.buypix.me/docs/api-reference/reports/get-summary

GET https://buypix.me/api/v1/reports/summary
Retorna resumo de depósitos, saques e comissões em um período.

## Query Parameters

<ParamField type="string">
  Data início no formato `YYYY-MM-DD` (padrão: início do mês atual)
</ParamField>

<ParamField type="string">
  Data fim no formato `YYYY-MM-DD` (padrão: hoje)
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET "https://buypix.me/api/v1/reports/summary?date_from=2026-01-01&date_to=2026-01-31" \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/reports/summary?date_from=2026-01-01&date_to=2026-01-31');
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const params = new URLSearchParams({ date_from: '2026-01-01', date_to: '2026-01-31' });
  const response = await fetch(`https://buypix.me/api/v1/reports/summary?${params}`, {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://buypix.me/api/v1/reports/summary',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      params={'date_from': '2026-01-01', 'date_to': '2026-01-31'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": {
      "period": {
        "from": "2026-01-01",
        "to": "2026-01-31"
      },
      "deposits": {
        "count": 150,
        "total_amount": 75000.00,
        "total_fees": 1500.00,
        "total_net": 73500.00
      },
      "withdrawals": {
        "count": 20,
        "total_amount": 10000.00,
        "total_fees": 150.00,
        "total_net": 9850.00
      },
      "commissions": {
        "count": 45,
        "total_amount": 450.00
      },
      "balance": 63200.50
    }
  }
  ```
</ResponseExample>


# Registrar Webhook
Source: https://docs.buypix.me/docs/api-reference/webhooks/create-webhook

POST https://buypix.me/api/v1/webhooks
Registrar um novo endpoint de webhook (máximo 5 por conta).

## Parâmetros

<ParamField type="string">
  URL do endpoint (HTTPS recomendado)
</ParamField>

<ParamField type="array">
  Lista de eventos para assinar. Use `["*"]` para assinar todos.
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X POST https://buypix.me/api/v1/webhooks \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -d '{"url": "https://meu-site.com/webhook", "events": ["deposit.completed", "withdrawal.completed"]}'
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/webhooks');
  curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
          'Content-Type: application/json',
      ],
      CURLOPT_POSTFIELDS => json_encode([
          'url' => 'https://meu-site.com/webhook',
          'events' => ['deposit.completed', 'withdrawal.completed'],
      ]),
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  // Guarde $response['data']['secret'] em local seguro!
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/webhooks', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer bpx_live_sua_chave',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: 'https://meu-site.com/webhook',
      events: ['deposit.completed', 'withdrawal.completed'],
    }),
  });
  const data = await response.json();
  // Guarde data.data.secret em local seguro!
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      'https://buypix.me/api/v1/webhooks',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      json={
          'url': 'https://meu-site.com/webhook',
          'events': ['deposit.completed', 'withdrawal.completed'],
      },
  )
  data = response.json()
  # Guarde data['data']['secret'] em local seguro!
  ```
</RequestExample>

<ResponseExample>
  ```json 201 theme={null}
  {
    "success": true,
    "message": "Webhook endpoint registrado com sucesso.",
    "data": {
      "id": "uuid-do-endpoint",
      "url": "https://meu-site.com/webhook",
      "events": ["deposit.completed", "withdrawal.completed"],
      "secret": "whsec_abc123...",
      "is_active": true
    }
  }
  ```
</ResponseExample>

<Warning>
  O campo `secret` é retornado **apenas na criação**. Guarde-o em local seguro — ele será usado para verificar a assinatura dos webhooks recebidos.
</Warning>


# Remover Webhook
Source: https://docs.buypix.me/docs/api-reference/webhooks/delete-webhook

DELETE https://buypix.me/api/v1/webhooks/{id}
Remove um endpoint de webhook.

## Path Parameters

<ParamField type="string">
  UUID do endpoint de webhook
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X DELETE https://buypix.me/api/v1/webhooks/uuid-do-endpoint \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $endpointId = 'uuid-do-endpoint';
  $ch = curl_init("https://buypix.me/api/v1/webhooks/{$endpointId}");
  curl_setopt_array($ch, [
      CURLOPT_CUSTOMREQUEST => 'DELETE',
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const endpointId = 'uuid-do-endpoint';
  const response = await fetch(`https://buypix.me/api/v1/webhooks/${endpointId}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  endpoint_id = 'uuid-do-endpoint'
  response = requests.delete(
      f'https://buypix.me/api/v1/webhooks/{endpoint_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "message": "Webhook endpoint removido com sucesso.",
    "data": null
  }
  ```
</ResponseExample>


# Listar Webhooks
Source: https://docs.buypix.me/docs/api-reference/webhooks/list-webhooks

GET https://buypix.me/api/v1/webhooks
Lista todos os endpoints de webhook registrados.

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET https://buypix.me/api/v1/webhooks \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/webhooks');
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/webhooks', {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://buypix.me/api/v1/webhooks',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "url": "https://meu-site.com/webhook",
        "events": ["*"],
        "is_active": true,
        "failure_count": 0,
        "last_triggered_at": "2026-02-20T12:00:00Z"
      }
    ]
  }
  ```
</ResponseExample>


# Visão Geral dos Webhooks
Source: https://docs.buypix.me/docs/api-reference/webhooks/overview

Receba notificações em tempo real quando eventos ocorrerem na sua conta.

## Como Funcionam

Webhooks são chamadas HTTP POST enviadas para a URL que você cadastrar sempre que um evento ocorrer. Cada chamada inclui uma assinatura HMAC-SHA256 para verificação.

### Webhook Dinâmico (Ad-Hoc)

Além de cadastrar endpoints fixos, você pode enviar o campo `webhook_url` diretamente no **POST /deposits** para receber callbacks naquela URL específica para aquela transação. Isso é útil quando você precisa de callbacks por transação sem gerenciar endpoints fixos.

```json theme={null}
POST /api/v1/deposits
{
    "amount": 100.00,
    "webhook_url": "https://meu-site.com/callback"
}
```

O BuyPix enviará todos os eventos de status (`deposit.created`, `deposit.completed`, `deposit.expired`, etc.) para a `webhook_url` informada **além** dos endpoints cadastrados.

## Eventos Disponíveis

| Evento                   | Descrição                                         |
| ------------------------ | ------------------------------------------------- |
| `deposit.created`        | Novo depósito criado                              |
| `deposit.completed`      | Depósito confirmado (PIX recebido, DePix enviado) |
| `deposit.expired`        | Depósito expirado (QR Code não pago a tempo)      |
| `deposit.error`          | Erro no processamento do depósito                 |
| `deposit.under_review`   | Depósito em análise/revisão pela equipe           |
| `deposit.canceled`       | Depósito cancelado                                |
| `deposit.refunded`       | Depósito reembolsado (valor devolvido via PIX)    |
| `deposit.delayed`        | Depósito com processamento atrasado               |
| `deposit.pending_pix2fa` | Aguardando verificação de segurança (Pix 2FA)     |
| `withdrawal.created`     | Saque criado — endereço de depósito gerado        |
| `withdrawal.completed`   | Saque concluído — PIX enviado com sucesso         |
| `withdrawal.failed`      | Erro no processamento do saque                    |
| `*`                      | Todos os eventos (wildcard)                       |

## Headers Enviados

```
X-Webhook-Signature: hash_hmac_sha256_do_body
X-Webhook-Event: deposit.completed
X-Webhook-Timestamp: 2026-02-20T12:00:00Z
User-Agent: BuyPix-Webhook/1.0
```

## Verificação de Assinatura (HMAC-SHA256)

Cada webhook inclui o header `X-Webhook-Signature` com hash HMAC-SHA256 do body usando o `secret` do seu endpoint.

```php theme={null}
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'];
$secret = 'whsec_seu_secret_aqui';

$expected = hash_hmac('sha256', $payload, $secret);

if (hash_equals($expected, $signature)) {
    // Webhook válido ✅
    $data = json_decode($payload, true);
} else {
    // Assinatura inválida ❌
    http_response_code(401);
}
```

## Exemplo de Handler Completo

```php theme={null}
<?php
$payload = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'] ?? '';
$secret = 'whsec_seu_secret_aqui';

$expected = hash_hmac('sha256', $payload, $secret);
if (!hash_equals($expected, $signature)) {
    http_response_code(401);
    exit('Assinatura inválida');
}

$event = json_decode($payload, true);

switch ($event['event']) {
    case 'deposit.completed':
        // Pagamento confirmado — liberar produto/serviço
        break;
    case 'deposit.under_review':
        // Depósito em análise — aguardar resolução
        break;
    case 'deposit.canceled':
        // Depósito cancelado
        break;
    case 'deposit.refunded':
        // Depósito reembolsado
        break;
    case 'withdrawal.completed':
        // PIX enviado com sucesso
        break;
}

http_response_code(200);
echo json_encode(['received' => true]);
```

<Warning>
  Seu endpoint deve responder com **HTTP 200** em até **30 segundos**. Após 3 falhas consecutivas, o webhook será desativado automaticamente.
</Warning>


# Criar Saque
Source: https://docs.buypix.me/docs/api-reference/withdrawals/create-withdrawal

POST https://buypix.me/api/v1/withdrawals
Cria um novo saque. Retorna um endereço de depósito para envio de DePix.

<Note>
  **Fluxo de Saque (2 etapas):**

  1. Crie o saque via API — receba `deposit_address` e `deposit_amount`
  2. Envie DePix para o endereço no valor exato antes do `expires_at`
  3. O sistema detecta o depósito e envia o PIX automaticamente
</Note>

## Parâmetros

<ParamField type="number">
  Valor em R\$ que deseja receber via PIX (mín: 5, máx: 5000)
</ParamField>

<ParamField type="string">
  Chave PIX de destino
</ParamField>

<ParamField type="string">
  Tipo da chave PIX: `cpf`, `cnpj`, `email`, `phone` ou `random`
</ParamField>

## Headers opcionais

<ParamField type="string">
  UUID único para prevenir duplicidade.
</ParamField>

## Status do Saque

| Status             | Descrição                            |
| ------------------ | ------------------------------------ |
| `awaiting_deposit` | Aguardando envio de DePix            |
| `deposit_detected` | DePix detectado na rede              |
| `confirmed`        | DePix confirmado                     |
| `processing`       | Processando conversão                |
| `processing_pix`   | Aguardando envio do PIX              |
| `completed`        | PIX enviado com sucesso ✅            |
| `expired`          | Expirado (DePix não enviado a tempo) |
| `error`            | Erro no processamento                |

<RequestExample>
  ```bash cURL theme={null}
  curl -X POST https://buypix.me/api/v1/withdrawals \
    -H "Authorization: Bearer bpx_live_sua_chave" \
    -H "Content-Type: application/json" \
    -H "X-Idempotency-Key: uuid-unico" \
    -d '{"amount": 100.00, "pix_key": "email@exemplo.com", "pix_key_type": "email"}'
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/withdrawals');
  curl_setopt_array($ch, [
      CURLOPT_POST => true,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
          'Content-Type: application/json',
          'X-Idempotency-Key: ' . uniqid(),
      ],
      CURLOPT_POSTFIELDS => json_encode([
          'amount' => 100.00,
          'pix_key' => 'email@exemplo.com',
          'pix_key_type' => 'email',
      ]),
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const response = await fetch('https://buypix.me/api/v1/withdrawals', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer bpx_live_sua_chave',
      'Content-Type': 'application/json',
      'X-Idempotency-Key': crypto.randomUUID(),
    },
    body: JSON.stringify({
      amount: 100.00,
      pix_key: 'email@exemplo.com',
      pix_key_type: 'email',
    }),
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.post(
      'https://buypix.me/api/v1/withdrawals',
      headers={
          'Authorization': 'Bearer bpx_live_sua_chave',
          'X-Idempotency-Key': 'uuid-unico',
      },
      json={
          'amount': 100.00,
          'pix_key': 'email@exemplo.com',
          'pix_key_type': 'email',
      },
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 201 theme={null}
  {
    "success": true,
    "message": "Saque criado com sucesso.",
    "data": {
      "id": "uuid-do-saque",
      "amount": 100.00,
      "fee_percent": 1.50,
      "fee_amount": 1.51,
      "net_amount": 100.00,
      "status": "awaiting_deposit",
      "pix_key": "email@exemplo.com",
      "pix_key_type": "email",
      "deposit_address": "VJL...endereço-de-deposito",
      "deposit_amount": 101.51,
      "expires_at": "2026-02-24T16:00:00+00:00"
    }
  }
  ```
</ResponseExample>


# Consultar Saque
Source: https://docs.buypix.me/docs/api-reference/withdrawals/get-withdrawal

GET https://buypix.me/api/v1/withdrawals/{id}
Consulta detalhes de um saque específico, incluindo endereço de depósito, status atualizado e comprovante.

## Path Parameters

<ParamField type="string">
  UUID do saque
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET https://buypix.me/api/v1/withdrawals/uuid-do-saque \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $withdrawalId = 'uuid-do-saque';
  $ch = curl_init("https://buypix.me/api/v1/withdrawals/{$withdrawalId}");
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const withdrawalId = 'uuid-do-saque';
  const response = await fetch(`https://buypix.me/api/v1/withdrawals/${withdrawalId}`, {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  withdrawal_id = 'uuid-do-saque'
  response = requests.get(
      f'https://buypix.me/api/v1/withdrawals/{withdrawal_id}',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": {
      "id": "uuid-do-saque",
      "amount": 100.00,
      "fee_percent": 1.50,
      "fee_amount": 1.51,
      "net_amount": 100.00,
      "status": "completed",
      "pix_key": "email@exemplo.com",
      "pix_key_type": "email",
      "reference_id": "ref-abc123",
      "txid": "txid-da-transacao",
      "confirmed_at": "2026-02-24T14:05:00+00:00",
      "deposit_address": "VJL...endereço-de-deposito",
      "deposit_amount": 101.51,
      "expires_at": "2026-02-24T16:00:00+00:00",
      "receipt_url": "https://buypix.me/receipts/uuid-do-saque/signed?expires=...&signature=..."
    }
  }
  ```
</ResponseExample>


# Listar Saques
Source: https://docs.buypix.me/docs/api-reference/withdrawals/list-withdrawals

GET https://buypix.me/api/v1/withdrawals
Lista saques com filtros e paginação.

## Query Parameters

<ParamField type="string">
  Filtrar por status (ex: `awaiting_deposit`, `completed`, `expired`)
</ParamField>

<ParamField type="string">
  Data início no formato `YYYY-MM-DD`
</ParamField>

<ParamField type="string">
  Data fim no formato `YYYY-MM-DD`
</ParamField>

<ParamField type="integer">
  Itens por página (1-100, padrão: 15)
</ParamField>

<RequestExample>
  ```bash cURL theme={null}
  curl -X GET "https://buypix.me/api/v1/withdrawals?per_page=10" \
    -H "Authorization: Bearer bpx_live_sua_chave"
  ```

  ```php PHP theme={null}
  $ch = curl_init('https://buypix.me/api/v1/withdrawals?per_page=10');
  curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_HTTPHEADER => [
          'Authorization: Bearer bpx_live_sua_chave',
      ],
  ]);
  $response = json_decode(curl_exec($ch), true);
  curl_close($ch);
  ```

  ```javascript JavaScript theme={null}
  const params = new URLSearchParams({ per_page: '10' });
  const response = await fetch(`https://buypix.me/api/v1/withdrawals?${params}`, {
    headers: { 'Authorization': 'Bearer bpx_live_sua_chave' },
  });
  const data = await response.json();
  ```

  ```python Python theme={null}
  import requests

  response = requests.get(
      'https://buypix.me/api/v1/withdrawals',
      headers={'Authorization': 'Bearer bpx_live_sua_chave'},
      params={'per_page': 10},
  )
  data = response.json()
  ```
</RequestExample>

<ResponseExample>
  ```json 200 theme={null}
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "amount": 100.00,
        "status": "completed",
        "pix_key": "email@exemplo.com",
        "created_at": "2026-02-20T12:00:00Z"
      }
    ],
    "meta": {
      "current_page": 1,
      "last_page": 3,
      "per_page": 10,
      "total": 25
    }
  }
  ```
</ResponseExample>


# Autenticação
Source: https://docs.buypix.me/docs/authentication

Todas as requisições exigem uma chave de API válida

## Chaves de API

Gere sua chave no [Painel BuyPix](https://buypix.me/app/api-keys). As chaves seguem o formato:

```
bpx_live_xxxxxxxxxxxxxxxxxxxxxxxx
```

## Métodos de Autenticação

### Bearer Token (recomendado)

```bash theme={null}
Authorization: Bearer bpx_live_sua_chave_aqui
```

### Header X-API-Key

```bash theme={null}
X-API-Key: bpx_live_sua_chave_aqui
```

## Exemplo

```bash theme={null}
curl -X GET https://buypix.me/api/v1/account \
  -H "Authorization: Bearer bpx_live_sua_chave_aqui"
```

<Warning>
  **Segurança:** Nunca exponha sua chave no frontend ou em código client-side. Use IP Whitelist no painel para restringir o acesso à sua chave.
</Warning>


# Idempotência
Source: https://docs.buypix.me/docs/idempotency

Previna transações duplicadas com chaves de idempotência

## Como Funciona

Nos endpoints `POST /deposits` e `POST /withdrawals`, envie o header `X-Idempotency-Key` com um UUID único:

```bash theme={null}
X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
```

Se a mesma chave for reenviada em **24 horas**, a resposta original será retornada com o header:

```
X-Idempotency-Replayed: true
```

<Tip>
  Use sempre um UUID v4 único para cada operação. Para retentativas da mesma operação, reenvie o mesmo UUID.
</Tip>


# Introdução
Source: https://docs.buypix.me/docs/introduction

Integre seu sistema com o BuyPix para criar depósitos PIX, gerenciar saques e receber notificações em tempo real via webhooks.

## Bem-vindo à API BuyPix

A API REST BuyPix permite que você integre operações de **PIX ↔ DePix (Liquid Network)** diretamente no seu sistema. Com ela, você pode:

* 💰 **Criar depósitos PIX** e receber QR Codes para pagamento
* 💸 **Criar saques** convertendo DePix para PIX automaticamente
* 🔗 **Gerenciar links de pagamento** e produtos com checkout
* 🔔 **Receber webhooks** em tempo real para cada mudança de status
* 📊 **Consultar relatórios** financeiros por período

## URL Base

```
https://buypix.me/api/v1
```

Todas as requisições devem usar **HTTPS**. Requisições HTTP serão rejeitadas.

## Formato

* Todas as requisições e respostas usam **JSON**
* Datas seguem o formato **ISO 8601** (ex: `2026-02-20T12:00:00Z`)
* Valores monetários são em **R\$ (BRL)** como `float`

## Começando

<CardGroup>
  <Card title="Autenticação" icon="key" href="/authentication">
    Configure sua chave de API para começar
  </Card>

  <Card title="Criar Depósito" icon="arrow-down" href="/api-reference/deposits/create-deposit">
    Crie seu primeiro depósito PIX
  </Card>

  <Card title="Webhooks" icon="bell" href="/api-reference/webhooks/overview">
    Receba notificações em tempo real
  </Card>

  <Card title="API Reference" icon="code" href="/api-reference/overview">
    Veja todos os endpoints disponíveis
  </Card>
</CardGroup>


# Rate Limiting
Source: https://docs.buypix.me/docs/rate-limiting

1.000 requisições por hora por chave de API

## Limites

Cada chave de API pode realizar até **1.000 requisições por hora**.

## Headers de Rate Limit

Os headers de rate limit são incluídos em todas as respostas:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1708430400
```

## Limite Excedido

Ao atingir o limite, você receberá `HTTP 429` com o header `Retry-After` indicando quantos segundos aguardar antes de tentar novamente.

```json theme={null}
{
  "success": false,
  "message": "Rate limit excedido. Tente novamente em 60 segundos.",
  "data": null,
  "timestamp": "2026-02-20T12:00:00Z"
}
```


# Formato de Resposta
Source: https://docs.buypix.me/docs/response-format

Todas as respostas seguem o mesmo formato JSON padronizado

## Resposta de Sucesso

```json theme={null}
{
  "success": true,
  "message": "Depósito criado com sucesso.",
  "data": { ... },
  "timestamp": "2026-02-20T12:00:00Z"
}
```

## Resposta de Erro

```json theme={null}
{
  "success": false,
  "message": "Chave de API inválida.",
  "data": null,
  "errors": null,
  "timestamp": "2026-02-20T12:00:00Z"
}
```

## Códigos HTTP

| Código | Descrição              |
| ------ | ---------------------- |
| `200`  | Sucesso                |
| `201`  | Recurso criado         |
| `401`  | Não autenticado        |
| `403`  | IP não autorizado      |
| `404`  | Recurso não encontrado |
| `422`  | Dados inválidos        |
| `429`  | Rate limit excedido    |




