FROM mysql:5
ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE presence
ENV MYSQL_USER user
ENV MYSQL_PASSWORD password
ENV MYSQL_HOST localhost
#ENV MYSQL_PORT 3306
COPY init.sql /docker-entrypoint-initdb.d/init.sql
WORKDIR /docker-entrypoint-initdb.d/
#COPY my.cnf /etc/mysql/my.cnf
RUN chown -R mysql:mysql /var/lib/mysql
CMD ["--character-set-server=latin1", "--character-set-filesystem=latin1", "--collation-server=latin1_swedish_ci"]
#RUN /etc/init.d/mysql start
#RUN  mysql -u root -p${MYSQL_ROOT_PASSWORD}   < /docker-entrypoint-initdb.d/init.sql