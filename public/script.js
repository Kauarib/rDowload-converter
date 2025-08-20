document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('videoURL');
    const downloadBtn = document.getElementById('downloadBtn');
    const messageArea = document.getElementById('messageArea');

    downloadBtn.addEventListener('click', async () => {
        const videoURL = urlInput.value.trim();

        if (videoURL === '') {
            showMessage('Por favor, insira uma URL do YouTube.', 'error');
            return;
        }

        // --- Início da Lógica de Fetch ---

        // 1. Prepara a interface para o download
        showMessage('Processando seu vídeo...', 'success');
        downloadBtn.disabled = true;
        downloadBtn.innerText = 'Baixando...';

        try {
            // 2. Chama o backend "nos bastidores"
            const response = await fetch(`/download?url=${encodeURIComponent(videoURL)}`);

            // 3. Verifica se o backend respondeu com um erro (status 400, 500, etc.)
            if (!response.ok) {
                // Se deu erro, pega a mensagem de erro JSON que o servidor enviou
                const errorData = await response.json();
                throw new Error(errorData.error || 'Ocorreu um erro desconhecido.');
            }

            // 4. Se deu certo, o backend enviou o vídeo. Agora preparamos o download no navegador.
            showMessage('Download iniciando!', 'success');
            
            // Pega o nome do arquivo do cabeçalho da resposta
            const disposition = response.headers.get('Content-Disposition');
            let filename = 'video.mp4'; // Nome padrão
            if (disposition && disposition.indexOf('attachment') !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = decodeURIComponent(matches[1].replace(/['"]/g, ''));
                }
            }

            // Converte a resposta em um "blob" (um tipo de arquivo)
            const blob = await response.blob();
            
            // Cria uma URL temporária para esse arquivo na memória do navegador
            const url = window.URL.createObjectURL(blob);
            
            // Cria um link invisível, clica nele para iniciar o download e depois o remove
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            // 5. Se qualquer passo falhar, mostra a mensagem de erro na página
            console.error('Erro no download:', error);
            showMessage(error.message, 'error');
        } finally {
            // 6. Independentemente de sucesso ou falha, reativa a interface
            downloadBtn.disabled = false;
            downloadBtn.innerText = 'Baixar MP4';
            setTimeout(() => {
                // Limpa a mensagem após alguns segundos
                messageArea.textContent = '';
                messageArea.className = 'message-area';
            }, 5000);
        }
    });

    function showMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
    }
});