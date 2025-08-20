
🎬 RDandC
Um aplicativo web simples e robusto para baixar vídeos do YouTube, construído com Node.js, Express e o poder do yt-dlp.

📝 Sobre o Projeto
Este projeto foi criado com o objetivo de fornecer uma interface web limpa e amigável para baixar vídeos do YouTube. O backend é construído em Node.js e utiliza o yt-dlp, a ferramenta de linha de comando mais poderosa e atualizada para interagir com o YouTube, garantindo alta confiabilidade e suporte para diversos formatos e qualidades de vídeo.

O frontend é minimalista, focado na usabilidade, permitindo que qualquer usuário cole uma URL e inicie o download com um único clique.

Status em Produção (Online)
É importante notar que, embora o aplicativo seja totalmente funcional para uso pessoal e local, rodá-lo como um serviço público em plataformas de nuvem (como Render, Vercel, etc.) enfrenta desafios significativos. O YouTube ativamente bloqueia e limita requisições vindas de endereços de IP de datacenters, resultando em erros (429 Too Many Requests, Sign in to confirm you’re not a bot, etc.). Este projeto serve como uma excelente demonstração das dificuldades técnicas em manter esse tipo de serviço online.

✨ Features
Download Simples: Cole a URL do vídeo do YouTube e baixe o arquivo MP4.

Backend Robusto: Utiliza yt-dlp para máxima compatibilidade e confiabilidade, contornando muitas das limitações de bibliotecas baseadas em Node.js.

Interface Limpa: Frontend simples, responsivo e intuitivo, sem distrações.

Feedback ao Usuário: Mensagens de sucesso e erro são exibidas na própria página, sem redirecionamentos, graças ao uso da API fetch.

Streaming Eficiente: O vídeo é transmitido diretamente para o usuário (stream pipe), sem ser salvo no servidor, economizando recursos.

🛠️ Tecnologias Utilizadas
Backend:

Node.js

Express.js

yt-dlp

Frontend:

HTML5

CSS3

JavaScript (Moderno, com async/await e fetch)

Deployment:

Render

🚀 Começando
Siga estas instruções para rodar o projeto no seu ambiente local.

Pré-requisitos
Você vai precisar ter as seguintes ferramentas instaladas na sua máquina:

Node.js (versão 14 ou superior)

Python (o pip, instalador de pacotes do Python, é necessário)

Instalação Local
Clone o repositório:

Bash

git clone https://github.com/seu-usuario/nome-do-repositorio.git
cd nome-do-repositorio
Instale as dependências do Node.js:

Bash

npm install
Instale a dependência de sistema yt-dlp:
O coração deste projeto é o yt-dlp. Instale-o globalmente na sua máquina usando pip:

Bash

pip install -U yt-dlp
Para verificar se a instalação funcionou, rode yt-dlp --version.

Executando a Aplicação
Inicie o servidor backend:

Bash

node server.js
Você deverá ver a mensagem Servidor rodando na porta 4000.

Abra o frontend:
No seu navegador, abra o arquivo public/index.html.

Pronto! Agora você pode colar URLs do YouTube e testar o download.

🌐 Deployment no Render
Para fazer o deploy desta aplicação no Render:

Start Command: node server.js

Build Command: npm install && pip install -U yt-dlp

Este comando garante que tanto as dependências do Node.js quanto a ferramenta yt-dlp sejam instaladas no ambiente de produção.

🧠 Desafios e Aprendizados
Este projeto foi uma jornada de aprendizado sobre os desafios do desenvolvimento de aplicações web no mundo real.

Limitações de Bibliotecas: A biblioteca inicial (ytdl-core) se mostrou pouco confiável, quebrando frequentemente devido a mudanças no YouTube. A transição para o yt-dlp como um processo filho (child_process) foi a solução para criar um sistema mais robusto.

Debugging de Deploy: O processo de deploy no Render exigiu a solução de múltiplos problemas:

Configuração correta da porta do servidor (process.env.PORT).

Instalação de dependências de sistema no ambiente de build.

Correção de caminhos de arquivo e URLs entre o frontend e o backend.

O "Muro" do YouTube: O desafio final foi lidar com as defesas do YouTube contra scraping. Erros como 429 Too Many Requests e Sign in to confirm you’re not a bot demonstraram a dificuldade de rodar este tipo de serviço a partir de IPs de datacenters, solidificando o projeto como uma excelente ferramenta pessoal e um estudo de caso sobre os limites da automação web.

📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
