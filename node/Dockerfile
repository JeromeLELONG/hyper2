FROM node
COPY package.json /usr/src/package.json
COPY start.sh /etc/start.sh
#RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 73C3DB2A
#RUN echo "deb http://ppa.launchpad.net/linuxuprising/java/ubuntu xenial main " | tee -a /etc/apt/sources.list.d/linux-uprising_java.list
#RUN apt-get -yq update
#RUN apt-get install -y openjdk-7-jdk 
#RUN apt-get install -y oracle-java10-installer
#RUN apt-get install -y oracle-java10-set-default
#RUN npm install -g protractor
#RUN webdriver-manager update
RUN npm install -g @angular/cli
WORKDIR /usr/src/