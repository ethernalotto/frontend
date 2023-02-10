#!/bin/sh
cp --remove-destination `readlink components/Controller.json` components/Controller.json
cp --remove-destination `readlink components/ICO.json` components/ICO.json
cp --remove-destination `readlink components/Lottery.json` components/Lottery.json
cp --remove-destination `readlink components/Token.json` components/Token.json
