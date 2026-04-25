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

    // Validação de valor mínimo BuyPix
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
    if (pollingInterval) clearInterval(pollingInterval);
    
    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`/api/status?id=${id}`);
            const result = await response.json();

            if (result.success) {
                const status = result.data.status.toLowerCase();
                console.log("Status oficial:", status);

                // Status de sucesso oficiais da BuyPix
                if (status === 'depix_sent' || status === 'paid' || status === 'confirmed' || status === 'completed') {
                    playSuccessSound();
                    stopAndShowSuccess();
                } else if (status === 'canceled' || status === 'expired' || status === 'refunded') {
                    stopAndShowError();
                }
            }
        } catch (e) {
            console.error("Erro no polling:", e);
        }
    }, 2000);
}

function playSuccessSound() {
    const sound = document.getElementById('sound-success');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Erro ao tocar som:", e));
    }
}

function stopAndShowSuccess() {
    clearInterval(pollingInterval);
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-success').classList.remove('hidden');
    if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
}

function stopAndShowError() {
    clearInterval(pollingInterval);
    document.getElementById('main-screen').classList.add('hidden');
    document.getElementById('qr-container').classList.add('hidden');
    document.getElementById('screen-error').classList.remove('hidden');
}
