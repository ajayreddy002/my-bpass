#!/usr/bin/env bash
cd /home/ubuntu/ts-bpass-ui/
sudo npm install
#sudo npm run build
nohup sudo npm run start >> nohup_log.out 2>&1 &