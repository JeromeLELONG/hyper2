#!/bin/bash

# Start the first process
#/usr/sbin/apache2ctl -D FOREGROUND
exec  webdriver-manager start &
exec npm start --prefix /usr/src/