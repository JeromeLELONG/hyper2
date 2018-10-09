FROM osixia/openldap:1.1.11
#ENV LDAP_ORGANISATION "My Company"
#ENV LDAP_DOMAIN "my-company.com"
#ENV LDAP_ADMIN_PASSWORD admin
#COPY export2.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/export2.ldif
COPY bootstrap.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/bootstrap.ldif
#COPY export.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/bootstrap.ldif
#RUN /etc/init.d/slapd start
#ENV CONTAINER_SERVICE_DIR /container/service
#ENV LDAP_SSL_HELPER_PREFIX ldap
#RUN /container/service/slapd/startup.sh
COPY cnam.schema /container/service/slapd/assets/config/bootstrap/schema/cnam.schema
#COPY test.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/test.ldif
#COPY test3.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/test3.ldif
#COPY cnam.ldif /container/service/slapd/assets/config/bootstrap/ldif/custom/cnam.ldif
ENV LDAP_ORGANISATION "My Company"
ENV LDAP_DOMAIN="cnam.fr"
ENV LDAP_ADMIN_PASSWORD "admin"
#RUN  ldapadd -x -D "cn=admin,dc=cnam,dc=fr" -w admin -f /ldap/export.ldif
# ldapadd -Y EXTERNAL -H ldapi:/// -f /ldap/export.schema