let currentAmount = "";
let pollingInterval = null;

// Referência ao elemento de áudio do HTML
function getSuccessSound() {
    return document.getElementById('sound-success');
}

function updateDisplay() {
    const display = document.getElementById('display');
    if (currentAmount === "") {
        display.innerText = "R$ 0,00";
        return;
    }
    const val = parseFloat(currentAmount) / 100;
    display.innerText = val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function addNumber(num) {
    if (currentAmount.length < 10) {
        currentAmount += num;
        updateDisplay();
    }
}

function clearDisplay() {
    currentAmount = "";
    updateDisplay();
    resetTerminal();
}

function cancelarVenda() {
    console.log("Venda cancelada pelo operador.");
    if (pollingInterval) clearInterval(pollingInterval);
    resetTerminal();
}

function resetTerminal() {
    if (pollingInterval) clearInterval(pollingInterval);
    currentAmount = "";
    
    document.body.style.backgroundColor = "#121212";
    document.getElementById('terminal').classList.remove('pago', 'negado');
    document.getElementById('screen-success').classList.add('hidden');
    document.getElementById('screen-error').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('keypad').classList.remove('hidden');
    if(document.getElementById('footer-actions')) document.getElementById('footer-actions').classList.remove('hidden');
    
    document.getElementById('status-msg').innerText = "Insira o valor";
    updateDisplay();
}

async function generatePix() {
    const amountValue = parseFloat(currentAmount) / 100;
    if (amountValue < 50.00) {
        alert("Valor mínimo R$ 50,00");
        return;
    }

    // Inicializa o som no primeiro clique para desbloquear o navegador
    const sound = getSuccessSound();
    if(sound) {
        sound.play().then(() => { sound.pause(); sound.currentTime = 0; }).catch(() => {});
    }

    document.getElementById('status-msg').innerText = "Gerando PIX...";
    
    try {
        const response = await fetch('/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountValue })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('qr-code').src = result.data.pix_qr_code_base64;
            document.getElementById('qr-container').classList.remove('hidden');
            document.getElementById('keypad').classList.add('hidden');
            if(document.getElementById('footer-actions')) document.getElementById('footer-actions').classList.add('hidden');
            document.getElementById('status-msg').innerText = "Aguardando pagamento...";
            startPolling(result.data.id, amountValue);
        } else {
            alert("Erro: " + result.message);
            resetTerminal();
        }
    } catch (error) {
        alert("Erro de conexão");
        resetTerminal();
    }
}

function startPolling(id, amount) {
    if (pollingInterval) clearInterval(pollingInterval);
    
    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`/api/status?id=${id}`);
            const result = await response.json();

            if (result.success) {
                const status = result.data.status.toLowerCase();
                const isSuccess = ['depix_sent', 'paid', 'confirmed', 'completed'].includes(status);
                const isFailure = ['expired', 'canceled', 'refunded', 'error'].includes(status);

                if (isSuccess) {
                    saveLocalSale(amount, id);
                    triggerSuccess();
                } else if (isFailure) {
                    triggerError();
                }
            }
        } catch (e) {
            console.error("Erro no polling:", e);
        }
    }, 2000);
}

function saveLocalSale(amount, id) {
    let sales = JSON.parse(localStorage.getItem('pending_sales') || '[]');
    if (!sales.find(s => s.id === id)) {
        sales.push({ id, amount, timestamp: new Date().toISOString() });
        localStorage.setItem('pending_sales', JSON.stringify(sales));
    }
}

function triggerSuccess() {
    clearInterval(pollingInterval);
    document.body.style.backgroundColor = "#00c853"; 
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-success').classList.remove('hidden');
    
    // TOCA O SOM DE CAIXA REGISTRADORA
    const sound = getSuccessSound();
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Erro áudio:", e));
    }
    
    if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
}

function triggerError() {
    clearInterval(pollingInterval);
    document.body.style.backgroundColor = "#d50000"; 
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-error').classList.remove('hidden');
}

// Funções para Modais e Links de Pagamento
function openLinkModal() { 
    document.getElementById('modal-link').classList.remove('hidden'); 
    document.getElementById('link-input-area').classList.remove('hidden');
    document.getElementById('link-result-area').classList.add('hidden');
}

function openCheckModal() { 
    document.getElementById('modal-check').classList.remove('hidden'); 
    fetchRecentSales();
}

function closeModals() { 
    document.getElementById('modal-link').classList.add('hidden'); 
    document.getElementById('modal-check').classList.add('hidden'); 
}

async function createPaymentLink() {
    const amount = document.getElementById('link-amount').value;
    const desc = document.getElementById('link-desc').value;
    if (amount < 50) { alert("Valor mínimo R$ 50,00"); return; }

    try {
        const response = await fetch('/api/payment-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, description: desc })
        });
        const result = await response.json();
        if (result.success) {
            const url = result.data.checkout_url;
            document.getElementById('link-input-area').classList.add('hidden');
            document.getElementById('link-result-area').classList.remove('hidden');
            document.getElementById('generated-link-url').innerText = url;
            
            document.getElementById('btn-share-link').onclick = () => {
                const text = `💰 Pagamento Pix\nValor: R$ ${amount}\nReferente a: ${desc || 'Venda'}\nLink: ${url}\n\nClique no link, na página que abrir você verá o QR code e a opção Pix copiar e cola, favor enviar o comprovante após o pagamento obrigado`;
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
                
                // Inicia o monitoramento dessa venda via link em segundo plano para tocar o som se pagar enquanto o app tá aberto
                startPolling(result.data.id, amount);
            };
        } else { alert(result.message); }
    } catch (e) { alert("Erro ao gerar link"); }
}

async function fetchRecentSales() {
    const list = document.getElementById('receipt-list');
    list.innerHTML = '<p style="color: #888; text-align:center;">Buscando vendas de hoje...</p>';

    try {
        const response = await fetch('/api/status');
        const result = await response.json();

        let sales = [];
        if (result.success) {
            sales = Array.isArray(result.data) ? result.data : (result.data.data || []);
        }

        if (sales.length > 0) {
            list.innerHTML = `
                <button onclick="fetchRecentSales()" style="width:100%; background:#333; color:#00e676; border:1px solid #444; padding:10px; border-radius:8px; margin-bottom:15px; font-weight:bold; cursor:pointer;">🔄 Atualizar Lista</button>
            `;
            sales.forEach(sale => {
                const isPaid = ['depix_sent', 'paid', 'confirmed', 'completed'].includes(sale.status.toLowerCase());
                const color = isPaid ? '#00e676' : '#ffea00';
                
                const item = document.createElement('div');
                item.className = "receipt-item";
                item.style.cssText = "background: #222; padding: 15px; border-radius: 10px; margin-bottom: 12px; cursor: pointer; border-left: 6px solid " + color + "; transition: 0.2s;";
                
                item.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:bold; font-size:18px;">R$ ${sale.amount.toFixed(2)}</span>
                        <span style="color:${color}; font-size:13px; font-weight:bold;">${isPaid ? 'CONCLUÍDO ✅' : 'PENDENTE ⏳'}</span>
                    </div>
                    <div style="font-size:12px; color:#888; margin-top:8px;">
                        Data: ${new Date(sale.created_at).toLocaleString()}<br>
                        ID: <span style="font-family:monospace;">${sale.id}</span>
                    </div>
                    <div id="detail-${sale.id}" class="hidden" style="margin-top:15px; border-top:1px solid #333; padding-top:10px;">
                        <p><b>Pagador:</b> ${sale.payer_name || 'Aguardando...'}</p>
                        <p><b>Descrição:</b> ${sale.description || 'Venda PDV'}</p>
                        ${isPaid ? `<button onclick="shareReceipt('${sale.id}', '${sale.amount}', '${sale.payer_name || 'Cliente'}')" style="width:100%; margin-top:10px; background:#25d366; color:#fff; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer;">Compartilhar Comprovante</button>` : ''}
                    </div>
                `;

                item.onclick = (e) => {
                    if(e.target.tagName !== 'BUTTON') {
                        const details = document.getElementById(`detail-${sale.id}`);
                        details.classList.toggle('hidden');
                    }
                };

                list.appendChild(item);
            });
        } else {
            list.innerHTML = `
                <button onclick="fetchRecentSales()" style="width:100%; background:#333; color:#00e676; border:1px solid #444; padding:10px; border-radius:8px; margin-bottom:15px; font-weight:bold; cursor:pointer;">🔄 Atualizar Lista</button>
                <p style="color: #888; text-align:center;">Nenhuma venda encontrada para hoje.</p>
            `;
        }
    } catch (e) {
        list.innerHTML = '<p style="color: #ff5252; text-align:center;">Erro ao carregar vendas. Verifique a conexão.</p>';
    }
}

function shareReceipt(id, amount, name) {
    const text = `📄 Comprovante de Pagamento\n--------------------------\n✅ Status: Pago\n💰 Valor: R$ ${amount}\n👤 Pagador: ${name}\n🆔 Transação: ${id}\n--------------------------\nPix Freitas Terminal`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}
