curl -i -k -X POST -F "username=exploit" https://hyperdev.cnam.fr/logout
curl -i -k -c /var/www/html/applications/hyper/data/cookiefile -X POST -F "username=exploit" -F "password=something" https://hyperdev.cnam.fr/authenticate
curl -i -k -b /var/www/html/applications/hyper/data/cookiefile -X POST -H "Content-Type: multipart/form-data" -F "file=@/var/www/html/applications/hyper/data/EXP_CRS.txt.gz" https://hyperdev.cnam.fr/chargementcours
