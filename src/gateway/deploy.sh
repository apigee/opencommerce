#!/usr/bin/env bash

cd $1

cp ./apiproxy/resources/node/package.orig ./apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/baas-ug000sr.apigee.net/g" ./apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/api-solutions/g" ./apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/opencommerce/g" ./apiproxy/resources/node/package.json

cp ./config.orig ./config.json
sed -i "" "s/__HOST__/open-commerce-dev.apigee.net/g" ./config.json

mvn clean install -Dusername=$2 -Dpassword=$3 -Dorg=open-commerce -P$4

cd ..