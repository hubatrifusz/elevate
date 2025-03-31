FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY . ./

WORKDIR /app/Elevate
RUN dotnet restore "Elevate.sln"
RUN dotnet publish "Elevate.csproj" -c Release -o /app/publish

FROM php:apache AS final
WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    mariadb-client \
    libmcrypt-dev \
    supervisor && \
    docker-php-ext-install mysqli

RUN curl -fLO https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip && \
    unzip phpMyAdmin-5.2.1-all-languages.zip && \
    mkdir -p /var/www/html/phpmyadmin && \
    mv phpMyAdmin-5.2.1-all-languages/* /var/www/html/phpmyadmin/ && \
    rm -rf phpMyAdmin-5.2.1-all-languages phpMyAdmin-5.2.1-all-languages.zip

RUN apt-get update && apt-get install -y \
    wget \
    apt-transport-https

RUN wget https://packages.microsoft.com/config/debian/11/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg -i packages-microsoft-prod.deb && \
    rm packages-microsoft-prod.deb

RUN apt-get update && \
    apt-get install -y dotnet-runtime-9.0

RUN a2enmod proxy proxy_http rewrite

RUN echo '<VirtualHost *:80>\n\
    ServerAdmin webmaster@localhost\n\
    DocumentRoot /var/www/html\n\
    \n\
    # Handle phpMyAdmin at /phpmyadmin\n\
    <Directory /var/www/html/phpmyadmin>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    # Proxy all other requests to .NET backend\n\
    ProxyPreserveHost On\n\
    RewriteEngine On\n\
    RewriteRule ^/phpmyadmin - [L]\n\
    RewriteRule ^/(.*)$ http://localhost:8080/$1 [P,L]\n\
    ProxyPassReverse / http://localhost:8080/\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

RUN sed -i 's/Listen 80/Listen 8000/g' /etc/apache2/ports.conf
RUN sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8000>/g' /etc/apache2/sites-available/000-default.conf

WORKDIR /app
COPY --from=build /app/publish /app/backend

RUN mkdir -p /var/log/supervisor
COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log
pidfile=/var/run/supervisord.pid

[program:apache]
command=apache2-foreground
redirect_stderr=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0

[program:dotnet]
command=dotnet /app/backend/Elevate.dll --urls=http://0.0.0.0:8080
redirect_stderr=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
EOF

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]