
# Imagem base
FROM nginx:alpine

# Arquivos da Pokédex
COPY index.html styles.css script.js config.js /usr/share/nginx/html/

# Porta do Nginx
EXPOSE 80