FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY . ./

WORKDIR /app/Elevate
RUN dotnet restore "Elevate.sln"
RUN dotnet publish "Elevate.csproj" -c Release -o /app/publish

FROM php:apache AS phpmyadmin
WORKDIR /var/www/html/phpmyadmin

RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    mariadb-client \
    libmcrypt-dev && \
    docker-php-ext-install mysqli

RUN curl -fLO https://files.phpmyadmin.net/phpMyAdmin/5.2.1/phpMyAdmin-5.2.1-all-languages.zip && \
    ls -al . && \
    unzip phpMyAdmin-5.2.1-all-languages.zip && \
    rm -rf /var/www/html/phpmyadmin && \
    mkdir -p /var/www/html/phpmyadmin && \
    mv phpMyAdmin-5.2.1-all-languages/* /var/www/html/phpmyadmin && \
    rm -rf phpMyAdmin-5.2.1-all-languages phpMyAdmin-5.2.1-all-languages.zip

FROM php:apache AS final
WORKDIR /var/www/html

COPY --from=phpmyadmin /var/www/html/phpmyadmin /var/www/html/phpmyadmin

WORKDIR /app
COPY --from=build /app/publish /app/backend

EXPOSE 80 8080

CMD ["bash", "-c", "apache2-foreground & dotnet /app/backend/Elevate.dll --urls=http://0.0.0.0:8080"]