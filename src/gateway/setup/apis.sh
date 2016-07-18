#!/usr/bin/env bash

host=$ORG-$ENV.apigee.net

# connector apis
cp ../carts-connector/apiproxy/resources/node/package.orig ../carts-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/$UGORG/g" ../carts-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../carts-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../carts-connector/apiproxy/resources/node/package.json

cp ../orders-connector/apiproxy/resources/node/package.orig ../orders-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/$UGORG/g" ../orders-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../orders-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../orders-connector/apiproxy/resources/node/package.json

cp ../products-connector/apiproxy/resources/node/package.orig ../products-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/$UGORG/g" ../products-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../products-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../products-connector/apiproxy/resources/node/package.json

cp ../skus-connector/apiproxy/resources/node/package.orig ../skus-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/$UGORG/g" ../skus-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../skus-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../skus-connector/apiproxy/resources/node/package.json

cp ../search-connector/apiproxy/resources/node/package.orig ../search-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/$UGORG/g" ../search-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../search-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../search-connector/apiproxy/resources/node/package.json

cp ../collections-connector/apiproxy/resources/node/package.orig ../collections-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/$UGORG/g" ../collections-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../collections-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../collections-connector/apiproxy/resources/node/package.json

cp ../locations-connector/apiproxy/resources/node/package.orig ../locations-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPORG__/$UGORG/g" ../locations-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../locations-connector/apiproxy/resources/node/package.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../locations-connector/apiproxy/resources/node/package.json

cp ../authentication-connector/config.orig ../authentication-connector/config.json
sed -i "" "s/__APPORG__/$UGORG/g" ../authentication-connector/config.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../authentication-connector/config.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../authentication-connector/config.json

cp ../userinfo/config.orig ../userinfo/config.json
sed -i "" "s/__APPORG__/$UGORG/g" ../userinfo/config.json
sed -i "" "s/__APPAPP__/$UGAPP/g" ../userinfo/config.json
sed -i "" "s/__APPHOST__/$UGURI/g" ../userinfo/config.json

#oauth
cp ../oauth/config.orig ../oauth/config.json
sed -i "" "s/__HOST__/$host/g" ../oauth/config.json

### delete default oauth API
echo `date`": Deleting oauth API !!"
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X DELETE "${URI}/v1/o/${ORG}/apis/oauth"  1>&2`
echo "${SETUP_RESULT}"
echo ""

# deploy the APIs
cd ../parent-pom/
mvn clean install -Dusername=${ADMIN_EMAIL} -Dpassword=${APW} -Dorg=${ORG} -P${ENV}
cd ../setup