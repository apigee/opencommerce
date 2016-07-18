#!/usr/bin/env bash

#consent-app
cp ../consent-app/apiproxy/resources/node/config.orig ../consent-app/apiproxy/resources/node/config.json
sed -i "" "s/__HOST__/$host/g" ../consent-app/apiproxy/resources/node/config.json
sed -i "" "s/__KEY__/$INTKEY/g" ../consent-app/apiproxy/resources/node/config.json

# deploy the APIs
cd ../parent-pom-apps/
mvn clean install -Dusername=${ADMIN_EMAIL} -Dpassword=${APW} -Dorg=${ORG} -P${ENV}
cd ../setup