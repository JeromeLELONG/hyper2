start: ## Start the client and server in docker for local development
	docker-compose up --build

start-prod: ## Start the client and server in docker for local development
	docker-compose -f docker-compose-production.yml  up --build

run:
	docker-compose up
stop: ## Start the client and server in docker for local development
	docker-compose down

install-php: 
	docker-compose run --rm --no-deps apache  bash -ci 'curl -sS https://getcomposer.org/installer | php -- --install-dir=/var/www/html/applications/hyper --filename=composer.phar'
	docker-compose run --rm --no-deps apache  bash -ci 'cd /var/www/html/applications/hyper && php /var/www/html/applications/hyper/composer.phar install --no-interaction'

install-node:
	docker-compose run --rm --no-deps node bash -ci 'npm cache clean -f && npm install --force'

install-protractor:
	#docker-compose up --build --no-deps -d apache
	#docker-compose run apache bash -ci 'cd /usr/src/ && npm cache clean -f && npm install --force'
	docker-compose run --rm --no-deps node bash -ci 'cd /usr/e2e/ && npm cache clean -f && npm install --force'
	#docker-compose down

install: install-php install-node install-protractor

reload-apache: 
	docker-compose run --rm --no-deps apache bash -ci '/usr/sbin/apache2ctl restart'

test-e2e-local: reinit-db exec-e2e

build-node-app:
	docker-compose run --rm --no-deps node bash -ci '/usr/src/compiler.sh'

build-image:
	docker build -t hyper --force-rm .

exec-e2e:
	docker cp selenium hyper:/usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'cd /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/ && unzip /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.42.zip'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'cd /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/ && tar -zxvf /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.23.0.tar.gz'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'mv /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.42'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'mv /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.23.0'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'cp /usr/src/node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-3.14.0.jar /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.14.0.jar'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'rm -rf /var/www/html/applications/hyper/data/*.zip 2> /dev/null || echo > /dev/null' 
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'rm -rf /var/www/html/applications/hyper/data/*.xlsx 2> /dev/null || echo > /dev/null' 
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'rm -rf /var/www/html/applications/hyper/data/*.csv 2> /dev/null || echo > /dev/null' 
	docker exec -it hyper bash -ci 'cd /usr/src/e2e && protractor'

reinit-db:
	docker exec -it mysql_hyper mysql -u root -proot -e "DROP DATABASE presence;" 
	docker exec -it mysql_hyper mysql -u root -proot -e "CREATE DATABASE presence;"
	docker exec -it mysql_hyper bash -ci 'mysql -u root -proot < /docker-entrypoint-initdb.d/init.sql'

test-e2e: # Start test environment
	#docker-compose down
	#sleep 5
	#docker-compose run --no-deps apache bash -ci 'webdriver-manager update'
	#docker-compose stop
	#docker-compose rm -f
	docker-compose -f docker-compose-test.yml  up --build -d
	sleep 10 # by security
	#docker-compose -f docker-compose-test.yml exec mysql mysql -u root -proot -D presence -e "DROP DATABASE presence;"
	#docker-compose -f docker-compose-test.yml exec mysql mysql -u root -proot -e "CREATE DATABASE presence;"
	#docker-compose -f docker-compose-test.yml exec mysql bash -ci 'mysql -u root -proot < /docker-entrypoint-initdb.d/init.sql'
	#docker exec -it hyper bash -ci 'cd /var/www/html/applications/hyper/angular && npm run e2e'
	#docker exec -it hyper bash -ci 'webdriver-manager update'
	#docker-compose -f docker-compose-test.yml exec apache webdriver-manager update
	docker cp selenium hyper:/usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'cd /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/ && unzip /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.42.zip'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'cd /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/ && tar -zxvf /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.23.0.tar.gz'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'mv /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/chromedriver_2.42'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'mv /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/geckodriver-v0.23.0'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'cp /usr/src/node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-3.14.0.jar /usr/lib/node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.14.0.jar'
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'rm -rf /var/www/html/applications/hyper/data/*.zip 2> /dev/null || echo > /dev/null' 
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'rm -rf /var/www/html/applications/hyper/data/*.xlsx 2> /dev/null || echo > /dev/null' 
	docker-compose -f docker-compose-test.yml exec apache bash -ci 'rm -rf /var/www/html/applications/hyper/data/*.csv 2> /dev/null || echo > /dev/null' 
	docker exec -it hyper bash -ci 'cd /usr/src/e2e && protractor'
	docker-compose -f docker-compose-test.yml down

test-unit: 
	docker-compose run --no-deps apache  bash -ci 'cd /var/www/html/applications/hyper/angular && npm run test'

test: test-unit test-e2e