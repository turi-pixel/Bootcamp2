# IMAGEM BASE: servido nginx em Linux Alpine (pequeno e seguro)
FROM nginx:alpine

# COPIA O CONTEUDO DA PASTA ATUAL PARA O DIRETORIO /usr/share/nginx/html/ DO CONTAINER
COPY index.html style.css script.js config.js /usr/share/nginx/html/

# EXPôE A PORTA PARA ACESSO EXTERNO
EXPOSE 80