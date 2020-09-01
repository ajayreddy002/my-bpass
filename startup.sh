if [ "$1" = "prod" ]
then
  echo "PROD starting";
  cp -f config/url-prod.js config/url.js
else
  echo "UAT starting"
  cp -f config/url-uat.js config/url.js
fi

npm run build
NODE_ENV=production pm2 start server.js --name bpass-ui  -i 1