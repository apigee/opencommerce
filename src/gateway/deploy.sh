#!/usr/bin/env bash

cd $1

cp ./apiproxy/resources/node/package.orig ./apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/api.usergrid.com/g" ./apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/rmahalank/g" ./apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/commerce/g" ./apiproxy/resources/node/package.json

cp ./config.orig ./config.json
sed -i "" "s/__HOST__/apisdeploytest-test.apigee.net/g" ./config.json

mvn clean install -Dusername=$2 -Dpassword=$3 -Dorg=apisdeploytest -P$4

cd ..