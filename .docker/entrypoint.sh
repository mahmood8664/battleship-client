#!/bin/bash
#printenv | grep ^PWA_ > /tmp/PWA_ENV
#while IFS= read -r line
#do
#  key=$(echo $line | awk -F"=" '{print "__"$1"__"}' )
#  value=$(echo $line | awk -F"=" '{print $2}')
#  find /usr/share/nginx/html/ -type f -exec sed -i "s#$key#$value#g" {} \;
#done < "/tmp/PWA_ENV"

nginx -g 'daemon off;'
