FROM debian:jessie
RUN apt-get -yq update
RUN apt-get install -y apt-utils
COPY package.json /usr/src/package.json
RUN apt-get -y install curl build-essential wget gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN npm cache clean -f
RUN npm install -g protractor
#RUN mkdir -p /usr/share/man/man1
#RUN apt-get install -y openjdk-8-jre-headless 
RUN apt-get install -y firefox-esr
RUN echo "oracle-java8-installer shared/accepted-oracle-license-v1-1 select true" | debconf-set-selections
RUN echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu trusty main" > /etc/apt/sources.list.d/webupd8team-java-trusty.list
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys EEA14886
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --force-yes --no-install-recommends oracle-java8-installer && apt-get clean all
RUN webdriver-manager update
WORKDIR /usr/src/