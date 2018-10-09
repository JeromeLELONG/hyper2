#!/bin/bash

# Start the first process
#/usr/sbin/apache2ctl -D FOREGROUND
exec apache2-foreground
#exec webdriver-manager start