# Serve o site estático (HTML/CSS/JS) usando um servidor web leve (nginx).
FROM nginx:alpine

# Copia só os arquivos do site para a pasta que o nginx publica.
COPY index.html home.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# O nginx já serve na porta 80 por padrão.
EXPOSE 80
