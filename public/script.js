document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('videoURL');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn'); // Pega o novo botão
    const messageArea = document.getElementById('messageArea');

    // --- Função para resetar a interface ---
    function resetUI() {
        urlInput.value = ''; // Limpa o campo de input
        showMessage('', ''); // Limpa a mensagem de status
        downloadBtn.classList.remove('hidden'); // Mostra o botão de download
        resetBtn.classList.add('hidden'); // Esconde o botão de reset
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Baixar MP4';
    }

    // --- Evento do botão de Download ---
    downloadBtn.addEventListener('click', async () => {
        const videoURL = urlInput.value.trim();

        if (videoURL === '') {
            showMessage('Por favor, insira uma URL do YouTube.', 'error');
            return;
        }

        downloadBtn.disabled = true;
        downloadBtn.textContent = 'Processando...';
        showMessage('Aguarde, iniciando o download...', 'info');

        try {
            const response = await fetch(`/download?url=${encodeURIComponent(videoURL)}`);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Muitas requisições. O servidor está temporariamente bloqueado. Tente novamente mais tarde.');
                }
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
            }

            const blob = await response.blob();
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'video.mp4';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (filenameMatch && filenameMatch.length > 1) {
                    filename = decodeURIComponent(filenameMatch[1]);
                }
            }
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            showMessage('Download concluído com sucesso!', 'success');

        } catch (error) {
            console.error('Erro no processo de download:', error);
            showMessage(`Falha no download: ${error.message}`, 'error');
        } finally {
            // Independente de sucesso ou falha, esconde o botão de download e mostra o de reset
            downloadBtn.classList.add('hidden');
            resetBtn.classList.remove('hidden');
        }
    });

    // --- Evento do novo botão de Reset ---
    resetBtn.addEventListener('click', () => {
        resetUI();
    });

    function showMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
    }
});