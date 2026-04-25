let currentAmount = "";
let pollingInterval = null;

// Pré-carregamento do som para evitar bloqueio do navegador
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

function resetTerminal() {
    if (pollingInterval) clearInterval(pollingInterval);
    currentAmount = "";
    
    // Reset visual completo
    document.body.style.backgroundColor = "#121212";
    document.getElementById('terminal').style.backgroundColor = "";
    document.getElementById('screen-success').classList.add('hidden');
    document.getElementById('screen-error').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('keypad').classList.remove('hidden');
    
    document.getElementById('status-msg').innerText = "Insira o valor";
    updateDisplay();
}

async function generatePix() {
    const amountValue = parseFloat(currentAmount) / 100;
    
    if (amountValue < 5.00) {
        alert("Valor mínimo R$ 5,00");
        return;
    }

    // Tenta tocar o som mudo para "pedir permissão" ao navegador
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
                console.log("Polling status:", status);

                // Gatilhos de Sucesso (inclui intermediários para o balcão)
                const isSuccess = [
                    'paid', 'confirmed', 'completed', 'depix_sent', 
                    'deposit.completed', 'processing', 'received'
                ].includes(status);

                // Gatilho de Processamento (Visual apenas)
                const isProcessing = ['under_review', 'deposit.under_review'].includes(status);

                if (isSuccess) {
                    saveLocalSale(amount, id);
                    triggerSuccess();
                } else if (isProcessing) {
                    document.getElementById('status-msg').innerText = "Pagamento em Processamento...";
                    document.body.style.backgroundColor = "#1b5e20"; // Verde escuro durante análise
                } else if (['canceled', 'expired', 'refunded'].includes(status)) {
                    triggerError();
                }
            }
        } catch (e) {
            console.error("Erro polling:", e);
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
    
    // UI de Sucesso Máximo
    document.body.style.backgroundColor = "#00c853"; // Verde Vibrante
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-success').classList.remove('hidden');
    
    // Som de Plin
    successSound.play().catch(e => console.log("Erro áudio:", e));
    
    if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
}

function triggerError() {
    clearInterval(pollingInterval);
    document.body.style.backgroundColor = "#d50000"; // Vermelho
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-error').classList.remove('hidden');
}
