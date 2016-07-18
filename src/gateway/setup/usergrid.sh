#!/usr/bin/env bash

### usergrid.sh

#echo curl -X POST https://${UGURI}/${UGORG}/${UGAPP}/token  -d '{"grant_type":"password", "username": "'${ADMIN_EMAIL}'", "password": "'${APW}'"}'

echo "Fetching App Services Token, to login ..."
token=`curl -X POST https://https://${UGURI}/management/token  -d '{"grant_type":"client_credentials", "client_id": "'${UGCLIENTID}'", "client_secret": "'${UGCLIENTSECRET}'"}' | sed 's/.*access_token\"\:\"\(.*\)\"\,\"expires_in.*/\1/'`

echo "Create App Services Application: ${UGAPP}, with Token: ${token}"
curl -X POST https://https://${UGURI}/management/orgs/${UGORG}/apps?access_token=${token} -d '{"name":"'${UGAPP}'"}'

creds=`curl -X POST https://https://${UGURI}/management/orgs/${UGORG}/apps/${UGAPP}/credentials?access_token="${token}" | sed 's/}//'`
echo "Got App Services Credentials for the App, that was created above: ${creds}"
c_id=${creds#*client_id*:}
c_id=`echo ${c_id%,*} | tr -d ' '`
sec=${creds#*client_secret*:}
sec=`echo ${sec%*} | tr -d ' '`
echo "Client ID: ${c_id}"
echo "Client Secret: ${sec}"

UGKEY=c_id
UGSECRET=sec

resp=`curl -X POST ${UGURI}/${UGORG}/${UGAPP}/roles/guest/permissions?access_token="${token}" -H "Content-Type: application/json" -H "Accept: application/json" -d '{"permission":"get,put,post,delete:/**"}'`
echo "Status: Updating Roles:${resp}"

