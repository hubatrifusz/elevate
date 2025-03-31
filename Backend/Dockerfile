FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY . ./

WORKDIR /app/Elevate

RUN dotnet restore "Elevate.sln"
RUN dotnet publish "Elevate.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

RUN apt-get update && apt-get install -y \
    apache2 \
    php \
    php-mysqli \
    php-mbstring \
    php-zip \
    php-gd \
    php-xml \
    php-curl \
    curl \
    unzip \
    supervisor \
    && rm -rf /var/lib/apt/lists/*

RUN a2enmod proxy proxy_http headers rewrite

WORKDIR /var/www/html
RUN curl -fsSL https://www.phpmyadmin.net/downloads/phpMyAdmin-latest-all-languages.zip -o phpmyadmin.zip \
    && unzip phpmyadmin.zip \
    && rm phpmyadmin.zip \
    && mv phpMyAdmin-* phpmyadmin \
    && chmod -R 755 phpmyadmin

RUN mkdir -p /var/www/html/phpmyadmin/tmp && chmod 777 /var/www/html/phpmyadmin/tmp
COPY <<EOF /var/www/html/phpmyadmin/config.inc.php
<?php
\$cfg['blowfish_secret'] = '$(openssl rand -base64 32)';
\$cfg['Servers'][1]['auth_type'] = 'cookie';
\$cfg['Servers'][1]['host'] = 'db';
\$cfg['Servers'][1]['port'] = '3306';
\$cfg['Servers'][1]['connect_type'] = 'tcp';
\$cfg['Servers'][1]['compress'] = false;
\$cfg['Servers'][1]['AllowNoPassword'] = false;
\$cfg['UploadDir'] = '';
\$cfg['SaveDir'] = '';
?>
EOF

RUN sed -i 's/Listen 80/Listen 8000/g' /etc/apache2/ports.conf
RUN sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8000>/g' /etc/apache2/sites-available/000-default.conf

COPY <<EOF /etc/apache2/sites-available/000-default.conf
<VirtualHost *:8000>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    ErrorLog \${APACHE_LOG_DIR}/error.log
    CustomLog \${APACHE_LOG_DIR}/access.log combined

    Alias /phpmyadmin /var/www/html/phpmyadmin
    <Directory /var/www/html/phpmyadmin>
        Options FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ProxyPreserveHost On
    ProxyPass /phpmyadmin !
    ProxyPass / http://localhost:8080/
    ProxyPassReverse / http://localhost:8080/
</VirtualHost>
EOF

COPY <<EOF /etc/supervisor/conf.d/supervisord.conf
[supervisord]
nodaemon=true
user=root
loglevel=info

[program:dotnet]
command=dotnet Elevate.dll --urls=http://0.0.0.0:8080
directory=/app
autostart=true
autorestart=true
stderr_logfile=/var/log/dotnet.err.log
stdout_logfile=/var/log/dotnet.out.log

[program:apache2]
command=/usr/sbin/apache2ctl -D FOREGROUND
autostart=true
autorestart=true
stderr_logfile=/var/log/apache2.err.log
stdout_logfile=/var/log/apache2.out.log
EOF

EXPOSE 8000

WORKDIR /app

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]