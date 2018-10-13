FROM php:7.0-apache
RUN apt-get -yq update
RUN apt-get install -y git
RUN \
    apt-get update && \
    apt-get install libldap2-dev openssl -y && \
    apt-get install -y zlib1g-dev && \
    rm -rf /var/lib/apt/lists/* && \
    docker-php-ext-configure ldap --with-libdir=lib/x86_64-linux-gnu/ && \
    docker-php-ext-install ldap 
RUN docker-php-ext-install mysqli pdo pdo_mysql zip 
RUN apt-get -yq update
RUN apt-get install -y libfreetype6-dev
RUN apt-get install -y libjpeg62-turbo-dev
RUN apt-get install -y libmcrypt-dev
RUN apt-get install -y libpng-dev
RUN apt-get install -y firefox-esr
RUN apt-get install -y chromium
RUN docker-php-ext-install -j$(nproc) iconv mcrypt
RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
RUN docker-php-ext-install -j$(nproc) gd
RUN openssl req -new -x509 -days 365 -keyout /etc/ssl/private/ssl-cert-snakeoil.key -out /etc/ssl/certs/ssl-cert-snakeoil.pem -nodes -subj  '/O=VirtualHost Website Company name/OU=Virtual Host Website department/CN=example.com'
WORKDIR /var/www/html/
COPY build/apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY build/apache2/sites-available/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
COPY build/apache2/apache2.conf /etc/apache2/apache2.conf
RUN a2enmod rewrite
RUN a2enmod ssl
RUN a2enmod headers
RUN a2ensite default-ssl
RUN a2enmod rewrite proxy proxy_http proxy_wstunnel proxy_html substitute filter
RUN chown -R www-data:www-data /var/www
RUN apt-get -y install curl build-essential wget gnupg
RUN mkdir -p /usr/share/man/man1
RUN apt-get install -y openjdk-8-jre-headless
RUN apt-get install -y unzip
RUN apt-get -y install curl build-essential wget gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
WORKDIR /var/www/html/applications/hyper/angular/
RUN npm cache clean -f
RUN npm install -g protractor
WORKDIR /usr/src
COPY src/vendor /var/www/html/applications/hyper/vendor
COPY src/composer.json /var/www/html/applications/hyper/composer.json
COPY src/config /var/www/html/applications/hyper/config
COPY src/data /var/www/html/applications/hyper/data
COPY src/module /var/www/html/applications/hyper/module
COPY src/public /var/www/html/applications/hyper/public
COPY src/angular/src/css /var/www/html/applications/hyper/public/css
COPY src/angular/src/js /var/www/html/applications/hyper/public/js
COPY src/angular/src/fonts /var/www/html/applications/hyper/public/fonts
COPY build/global.php /var/www/html/applications/hyper/config/autoload/global.php
RUN chmod 777 /var/www/html/applications/hyper/data
#COPY build/development.local.php /var/www/html/applications/hyper/config/autoload/development.local.php