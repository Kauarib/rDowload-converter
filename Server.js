const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process'); // Módulo para executar comandos externos
const ytdl = require('@distube/ytdl-core'); // Usaremos para pegar o título rapidamente

const app = express();
app.use(cors());

// A porta será a definida pelo Render (process.env.PORT) ou 4000 se não houver nenhuma.
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

// Rota para o health check do Render e para a página inicial
app.get('/', (req, res) => {
    res.send('Servidor do Downloader está funcionando!');
});

// Rota principal de download,  yt-dlp
app.get('/download', async (req, res) => {
    try {
        const url = req.query.url;

        // 1. Validação rápida da URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: "URL inválida." });
        }

        // 2. Pegamos o título usando ytdl-core, pois é rápido
        const info = await ytdl.getInfo(url);
        const videoTitle = info.videoDetails.title;
        const safeFilename = videoTitle.replace(/[^a-zA-Z0-9\s\-_.]/g, '') || 'video'; // Limpa o nome do arquivo

        // 3. Define os cabeçalhos para o download
        res.header('Content-Disposition', `attachment; filename="${safeFilename}.mp4"`);
        res.header('Content-Type', 'video/mp4');

        // 4. Configura e executa o comando yt-dlp
        console.log(`Iniciando download com yt-dlp para: ${url}`);
        const ytDlp = spawn('yt-dlp', [
            url,
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', // Formato que garante vídeo+áudio da melhor qualidade
            '--no-warnings', // Não poluir os logs com avisos
            '-o', '-',       // '-o -' significa que a saída deve ser para o stdout (stream)
        ]);

        // 5. Redireciona a saída do yt-dlp (o vídeo) diretamente para a resposta do Express
        ytDlp.stdout.pipe(res);

        // 6. Captura e exibe possíveis erros do processo yt-dlp nos logs do Render
        ytDlp.stderr.on('data', (data) => {
            console.error(`yt-dlp stderr: ${data}`);
        });

        ytDlp.on('close', (code) => {
            if (code !== 0) {
                console.log(`Processo yt-dlp terminou com código ${code}`);
            } else {
                console.log('Download concluído com sucesso.');
            }
        });

        // O que fazer se o cliente fechar a conexão no meio do download
        req.on('close', () => {
            console.log('Conexão fechada pelo cliente. Interrompendo yt-dlp.');
            ytDlp.kill(); // Interrompe o processo yt-dlp para não gastar recursos
        });

    } catch (err) {
        // Este catch agora pega principalmente erros do getInfo
        console.error('Erro ao obter informações do vídeo:', err.message);
        res.status(500).json({ error: "Falha ao obter informações do vídeo. Verifique a URL." });
    }
});