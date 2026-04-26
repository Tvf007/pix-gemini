let currentAmount = "";
let pollingInterval = null;

// Pré-carregamento do som
const successSound = new Audio("https://www.soundjay.com/misc/sounds/cash-register-purchase-1.mp3");
successSound.load();

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
    if(document.querySelector('.footer-actions')) document.querySelector('.footer-actions').classList.remove('hidden');
    
    document.getElementById('status-msg').innerText = "Insira o valor";
    updateDisplay();
}

async function generatePix() {
    const amountValue = parseFloat(currentAmount) / 100;
    
    // NOVO VALOR MÍNIMO: R$ 50,00
    if (amountValue < 50.00) {
        alert("Valor mínimo R$ 50,00");
        return;
    }

    successSound.play().then(() => {
        successSound.pause();
        successSound.currentTime = 0;
    }).catch(() => {});

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
            if(document.querySelector('.footer-actions')) document.querySelector('.footer-actions').classList.add('hidden');
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
                console.log("Status detectado:", status);

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
    
    successSound.play().catch(e => console.log("Erro áudio:", e));
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
function openLinkModal() { document.getElementById('modal-link').classList.remove('hidden'); }
function openCheckModal() { document.getElementById('modal-check').classList.remove('hidden'); }
function closeModals() { 
    document.getElementById('modal-link').classList.add('hidden'); 
    document.getElementById('modal-check').classList.add('hidden'); 
    document.getElementById('receipt-result').classList.add('hidden');
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
            const text = `Pagamento Pix: R$ ${amount}\n${desc}\nLink: ${url}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
            closeModals();
        } else { alert(result.message); }
    } catch (e) { alert("Erro ao gerar link"); }
}

async function checkReceipt() {
    const id = document.getElementById('check-id').value;
    if (!id) return;

    try {
        const response = await fetch(`/api/payment-links?id=${id}`);
        const result = await response.json();
        const box = document.getElementById('receipt-result');
        box.classList.remove('hidden');

        if (result.success) {
            const d = result.data;
            let html = `<b>Status:</b> ${d.status}<br>`;
            html += `<b>Valor:</b> R$ ${d.amount.toFixed(2)}<br>`;
            if(d.payer_name) html += `<b>Pagador:</b> ${d.payer_name}<br>`;
            
            if (d.status === 'depix_sent' || d.status === 'paid' || d.status === 'confirmed') {
                html += `<button onclick="shareReceipt('${d.id}', '${d.amount}', '${d.payer_name || 'Cliente'}')" style="width:100%; margin-top:10px; background:#25d366; color:#fff; border:none; padding:8px; border-radius:5px;">Compartilhar Whats</button>`;
            }
            box.innerHTML = html;
        } else { box.innerHTML = "Transação não encontrada."; }
    } catch (e) { alert("Erro ao verificar"); }
}

function shareReceipt(id, amount, name) {
    const text = `Comprovante de Pagamento Pix\nID: ${id}\nValor: R$ ${amount}\nPagador: ${name}\nStatus: Confirmado ✅`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}
