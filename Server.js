// Importa as bibliotecas necessárias
const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');

// Inicializa o aplicativo Express
const app = express();
app.use(express.static('public'));
const PORT = process.env.PORT||4000; // Porta em que o servidor irá rodar

// Habilita o CORS para permitir requisições do frontend
app.use(cors());

// Inicia o servidor e o faz "escutar" na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Define a rota principal para o download
// Usaremos GET para simplicidade, passando a URL como query parameter
app.get('/download', async (req, res) => {
    try {
        // Pega a URL do vídeo da query string (ex: /download?url=VIDEO_URL)
        const url = req.query.url;

        // Validação básica da URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: "URL inválida." });
        }

        // Obtém informações do vídeo para pegar o título
        const info = await ytdl.getInfo(url);
        const videoTitle = info.videoDetails.title;

        // Define os cabeçalhos da resposta para forçar o download no navegador
        // Content-Disposition: informa ao navegador para baixar o arquivo com um nome específico
        // Usamos encodeURIComponent para garantir que caracteres especiais no título sejam tratados corretamente
        res.header('Content-Disposition', `attachment; filename="${encodeURIComponent(videoTitle)}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        // Faz o pipe do stream do vídeo diretamente para a resposta
        // Isso é eficiente pois não carrega o vídeo inteiro na memória do servidor
        ytdl(url, {
            format: 'mp4',
            quality: 'highest' // Você pode escolher a qualidade aqui
        }).pipe(res);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Falha ao tentar baixar o vídeo." });
    }
});