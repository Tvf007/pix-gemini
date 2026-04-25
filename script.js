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
    clearInterval(pollingInterval);
    document.getElementById('terminal').classList.remove('pago', 'negado');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('keypad').classList.remove('hidden');
    document.getElementById('btn-new-sale').classList.add('hidden');
    document.getElementById('success-icon').classList.add('hidden');
    document.getElementById('status-msg').innerText = "Insira o valor";
    updateDisplay();
}

async function generatePix() {
    if (currentAmount === "" || parseInt(currentAmount) === 0) return;

    const amount = parseFloat(currentAmount) / 100;
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
            startPolling(result.data.id);
        } else {
            alert("Erro: " + result.message);
            resetTerminal();
        }
    } catch (error) {
        alert("Erro de conexão");
        resetTerminal();
    }
}

function startPolling(id) {
    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`/api/status?id=${id}`);
            const result = await response.json();

            if (result.success) {
                const status = result.data.status;
                if (status === 'depix_sent' || status === 'paid' || status === 'confirmed') {
                    document.getElementById('terminal').classList.add('pago');
                    document.getElementById('status-msg').innerText = "PAGAMENTO CONFIRMADO";
                    document.getElementById('qr-container').classList.add('hidden');
                    document.getElementById('success-icon').classList.remove('hidden');
                    document.getElementById('btn-new-sale').classList.remove('hidden');
                    clearInterval(pollingInterval);
                    // Vibração de sucesso no celular se disponível
                    if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
                } else if (status === 'refunded') {
                    document.getElementById('terminal').classList.add('negado');
                    document.getElementById('status-msg').innerText = "PAGAMENTO REEMBOLSADO";
                    document.getElementById('btn-new-sale').classList.remove('hidden');
                    clearInterval(pollingInterval);
                }
            }
        } catch (e) {
            console.error("Polling error", e);
        }
    }, 2000); // Polling a cada 2 segundos
}
