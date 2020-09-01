#!/usr/bin/env bash
sudo pm2 delete all || true
sudo killall node || true
sudo rm -rf /home/ubuntu/ts-bpass-ui/
echo "Application Stopped"