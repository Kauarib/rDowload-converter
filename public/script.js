document.addEventListener('DOMContentLoaded', () => {
    const urlInput = document.getElementById('videoURL');
    const downloadBtn = document.getElementById('downloadBtn');
    const messageArea = document.getElementById('messageArea');

    downloadBtn.addEventListener('click', () => {
        const videoURL = urlInput.value.trim();

        if (videoURL === '') {
            showMessage('Por favor, insira uma URL do YouTube.', 'error');
            return;
        }

        // Mostra uma mensagem de "iniciando" e desabilita o botão
        showMessage('Iniciando download...', 'success');
        downloadBtn.disabled = true;
        downloadBtn.innerText = 'Baixando...';

        // A mágica acontece aqui: redireciona o navegador para a URL do nosso backend
        // O backend responderá com o arquivo de vídeo, forçando o download
        // Usamos encodeURIComponent para garantir que a URL seja passada corretamente
        window.location.href = `http://localhost:4000/download?url=${encodeURIComponent(videoURL)}`;

        // Um pequeno truque para reativar o botão depois de um tempo
        // Já que não temos um feedback direto de quando o download começou,
        // esperamos alguns segundos e reativamos a interface.
        setTimeout(() => {
            resetUI();
        }, 5000); // 5 segundos
    });

    function showMessage(message, type) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
    }

    function resetUI() {
        downloadBtn.disabled = false;
        downloadBtn.innerText = 'Baixar MP4';
        urlInput.value = '';
        // Limpa a mensagem após um tempo
        setTimeout(() => {
            showMessage('', '');
        }, 3000);
    }
});