#!/usr/bin/env bash

### Delete App Resources ###
echo ------------------------------------------------------------------------------------------
echo `date`": Deleting Developer, Product, App ; Please hang On !!"
echo ------------------------------------------------------------------------------------------

### apps
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X DELETE "${URI}/v1/o/${ORG}/developers/opencommerce@apigee.net/apps/Retail_App"  1>&2`
echo "${SETUP_RESULT}"
echo ""

### developer
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X DELETE "${URI}/v1/o/${ORG}/developers/opencommerce@apigee.net"  1>&2`
echo "${SETUP_RESULT}"
echo ""

### products
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X DELETE "${URI}/v1/o/${ORG}/apiproducts/Retail_APIs"  1>&2`
echo "${SETUP_RESULT}"
echo ""

### End - Delete App Resources ###


### Create App Resources Now ###
echo ------------------------------------------------------------------------------------------
echo `date`": Creating Developer, Product, App ; Please hang On !!"
echo ------------------------------------------------------------------------------------------

### developer
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X POST "${URI}/v1/o/${ORG}/developers" -H "Content-Type: application/json" -d '{"email":"opencommerce@apigee.net", "firstName":"OpenCommerce","lastName":"Developer","userName":"opencommerce"}' 1>&2`
echo "${SETUP_RESULT}"
echo ""

### products
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X POST "${URI}/v1/o/${ORG}/apiproducts" -H "Content-Type: application/json" -d '{"approvalType":"auto", "displayName":"Retail APIs","name":"Retail_APIs","environments":["test","prod"],"scopes":["openid","orders","carts"], "proxies":["oauth", "carts", "collections", "locations", "orders", "products", "search", "skus", "userinfo"]}' 1>&2`
echo "${SETUP_RESULT}"
echo ""

### apps

#### app
callback_url=http://apigee.com/about
app_data="{\"name\":\"Retail_App\", \"callbackUrl\":\"${callback_url}\"}"
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X POST "${URI}/v1/o/${ORG}/developers/opencommerce@apigee.net/apps" -H "Content-Type: application/json" -d "$app_data" `
echo "${SETUP_RESULT}"

apikey=${SETUP_RESULT#*consumerKey*:}
apikey=`echo ${apikey%,*consumerSecret*} | tr -d ' '`
apisecret=${SETUP_RESULT#*consumerSecret*:}
apisecret=`echo ${apisecret%,*expiresAt*} | tr -d ' '`
echo "Generated API Key: ${apikey}"
echo "Generated API Secret: ${apisecret}"
echo ""

ckey=`echo ${apikey} | tr -d '"'`
SETUP_RESULT=`curl -u "${ADMIN_EMAIL}:${APW}" -X POST "${URI}/v1/o/${ORG}/developers/opencommerce@apigee.net/apps/Retail_App/keys/${ckey}" -H "Content-Type: application/xml" -d '<CredentialRequest><ApiProducts><ApiProduct>Retail_APIs</ApiProduct></ApiProducts></CredentialRequest>' `
echo "${SETUP_RESULT}"

### End - Create App Resources ###