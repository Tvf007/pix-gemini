let currentAmount = "";
let pollingInterval = null;

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
    
    document.getElementById('status-msg').innerText = "Insira o valor";
    updateDisplay();
}

async function generatePix() {
    const amount = parseFloat(currentAmount) / 100;
    if (amount < 5.00) {
        alert("Valor mínimo R$ 5,00");
        return;
    }

    document.getElementById('status-msg').innerText = "Gerando PIX...";
    
    try {
        const response = await fetch('/api/pay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });

        const result = await response.json();

        if (result.success) {
            document.getElementById('qr-code').src = result.data.pix_qr_code_base64;
            document.getElementById('qr-container').classList.remove('hidden');
            document.getElementById('keypad').classList.add('hidden');
            document.getElementById('status-msg').innerText = "Aguardando pagamento...";
            startPolling(result.data.id, amount);
        } else {
            alert("Erro: " + result.message);
            resetTerminal();
        }
    } catch (error) {
        alert("Erro de conexão");
        resetTerminal();
    }
}

function startPolling(id, amountValue) {
    if (pollingInterval) clearInterval(pollingInterval);
    
    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`/api/status?id=${id}`);
            const result = await response.json();

            if (result.success) {
                const status = result.data.status.toLowerCase();
                console.log("Status atual:", status);

                // GATILHO IMEDIATO: Qualquer sinal de que o PIX foi enviado/recebido
                // Ignora a liquidação de 5h para dar feedback ao lojista
                const successStatuses = ['depix_sent', 'paid', 'confirmed', 'completed', 'deposit.completed', 'processing'];
                const errorStatuses = ['canceled', 'expired', 'refunded', 'deposit.canceled', 'deposit.expired'];

                if (successStatuses.includes(status)) {
                    saveLocalSale(amountValue);
                    handleSuccess();
                } else if (errorStatuses.includes(status)) {
                    handleError();
                }
            }
        } catch (e) {
            console.error("Erro polling:", e);
        }
    }, 2000);
}

// Contingência: Salva a venda localmente para o relatório enquanto a API não liquida (trava de 5h)
function saveLocalSale(amount) {
    let sales = JSON.parse(localStorage.getItem('pending_sales') || '[]');
    sales.push({
        amount: amount,
        timestamp: new Date().toISOString(),
        status: 'Aguardando Liquidação (5h)'
    });
    localStorage.setItem('pending_sales', JSON.stringify(sales));
}

function handleSuccess() {
    clearInterval(pollingInterval);
    document.body.style.backgroundColor = "#28a745"; 
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-success').classList.remove('hidden');
    
    const sound = document.getElementById('sound-success');
    if (sound) sound.play().catch(e => console.log("Erro áudio:", e));
    
    if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
}

function handleError() {
    clearInterval(pollingInterval);
    document.body.style.backgroundColor = "#dc3545";
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-error').classList.remove('hidden');
}
