#!/bin/sh
git pull
npm install
bower install
grunt build --force
if ! [ -d "/var/www/html/admin" ]; then
 mkdir /var/www/html/admin;
 echo "directory not exist; creating directory"
else
  rm -rf /var/www/html/admin/*;
  echo "exist";
fi;
mv dist/* /var/www/html/admin/