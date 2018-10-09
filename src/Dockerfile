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
RUN apt install -y net-tools
RUN openssl req -new -x509 -days 365 -keyout /etc/ssl/private/ssl-cert-snakeoil.key -out /etc/ssl/certs/ssl-cert-snakeoil.pem -nodes -subj  '/O=VirtualHost Website Company name/OU=Virtual Host Website department/CN=example.com'
WORKDIR /var/www/html/
COPY apache2/sites-available/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY apache2/sites-available/default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
COPY apache2/apache2.conf /etc/apache2/apache2.conf
RUN a2enmod rewrite
ENV CHROME_BIN /usr/bin/chromium
RUN a2enmod ssl
RUN a2enmod headers
RUN a2ensite default-ssl
RUN a2enmod rewrite proxy proxy_http proxy_wstunnel proxy_html substitute filter
#COPY composer.phar /var/www/html/applications/hyper/composer.phar
#COPY composer.json /var/www/html/applications/hyper/composer.json
#RUN php /var/www/html/composer.phar install 
RUN chown -R www-data:www-data /var/www
RUN mkdir -p /usr/share/man/man1
RUN apt-get install -y openjdk-8-jre-headless
RUN apt-get install -y unzip
RUN apt-get -y install curl build-essential wget gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
WORKDIR /var/www/html/applications/hyper/angular/
RUN npm cache clean -f
#RUN npm install -g @angular/cli
RUN npm install -g protractor
#RUN npm install --save protractor@4.0.13
#RUN apt-get install -y firefox-esr 
WORKDIR /usr/src
#COPY e2e /usr/src
COPY start.sh /etc/
#RUN webdriver-manager update
CMD ["/bin/sh","/etc/start.sh"] 