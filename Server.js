const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const url = require('url'); // Módulo nativo do Node.js para analisar URLs

const app = express();
app.use(cors());
app.use(express.static('public')); // Serve arquivos estáticos da pasta 'public'

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Servidor do Downloader está funcionando!');
});

app.get('/download', (req, res) => {
    try {
        const videoUrl = req.query.url;
        
        // Validação básica da URL
        if (!videoUrl || !videoUrl.includes('youtube.com')) {
           return res.status(400).json({ error: "URL do YouTube inválida." });
        }

        // Extrai o ID do vídeo da URL para usar como nome do arquivo
        const parsedUrl = new url.URL(videoUrl);
        const videoId = parsedUrl.searchParams.get('v');
        const filename = videoId ? `${videoId}.mp4` : 'video.mp4';

        // Define os cabeçalhos para o download
        res.header('Content-Disposition', `attachment; filename="${filename}"`);
        res.header('Content-Type', 'video/mp4');

        // Configura e executa o comando yt-dlp
        console.log(`Iniciando download com yt-dlp para: ${videoUrl}`);
        const ytDlp = spawn('yt-dlp', [
            videoUrl,
            '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            '--no-warnings',
            '-o', '-',
        ]);

        ytDlp.stdout.pipe(res);

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

        req.on('close', () => {
            console.log('Conexão fechada pelo cliente. Interrompendo yt-dlp.');
            ytDlp.kill();
        });

    } catch (err) {
        console.error('Erro na rota /download:', err.message);
        res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
    }
});