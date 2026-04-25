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
                console.log("Status em tempo real:", status);

                // GATILHO DE BALCÃO: Aceita qualquer status que indique pagamento em processamento ou concluído
                // Isso ignora a trava de 5h para o feedback visual/sonoro
                const successSignals = [
                    'depix_sent', 'paid', 'confirmed', 'completed', 
                    'deposit.completed', 'processing', 'under_review', 
                    'received', 'deposit.under_review'
                ];
                
                const failureSignals = [
                    'canceled', 'expired', 'refunded', 
                    'deposit.canceled', 'deposit.expired'
                ];

                if (successSignals.includes(status)) {
                    console.log(">>> SUCESSO DETECTADO! Disparando notificações...");
                    saveLocalSale(amountValue, id);
                    handleSuccess();
                } else if (failureSignals.includes(status)) {
                    handleError();
                }
            }
        } catch (e) {
            console.error("Erro no polling de diagnóstico:", e);
        }
    }, 2000);
}

// Persistência local para contornar o delay de 5h no relatório oficial
function saveLocalSale(amount, id) {
    let sales = JSON.parse(localStorage.getItem('pending_sales') || '[]');
    // Evita duplicidade se o polling rodar mais de uma vez antes de parar
    if (!sales.find(s => s.id === id)) {
        sales.push({
            id: id,
            amount: amount,
            timestamp: new Date().toISOString(),
            status: 'PAGO (Aguardando Liquidação)'
        });
        localStorage.setItem('pending_sales', JSON.stringify(sales));
    }
}

function handleSuccess() {
    clearInterval(pollingInterval);
    document.body.style.backgroundColor = "#28a745"; 
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-success').classList.remove('hidden');
    
    const sound = document.getElementById('sound-success');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Erro ao tocar som de sucesso:", e));
    }
    
    if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
}

function handleError() {
    clearInterval(pollingInterval);
    document.body.style.backgroundColor = "#dc3545";
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-error').classList.remove('hidden');
}
