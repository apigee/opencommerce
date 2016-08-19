#!/usr/bin/env bash

# URI of the Management API to the Edge Org where you wish to deploy the proxies
URI="https://api.enterprise.apigee.com"

# URI of the BaaS / Usergrid API which will be used as a sandbox backend
UGURI="https://api.usergrid.com"

# Organization name of the Edge Org where you will be deploying the proxies
ORG=

# Environment in the Org specified above to which you will deploy the proxies
ENV=

# Email of a user that has sufficient permissions to import and deploy proxies in the specified Org
ADMIN_EMAIL=

# Edge Password of the user specified above
APW=

# Organization name of the BaaS instance that is being used to deploy the sandbox
UGORG=

# Application in the above BaaS instance which will be used for the sandbox. It will be created if it doesn't exist.
UGAPP=

# Organization Client ID of the BaaS where you wish to install the sandbox
UGCLIENTID=

# Organization Client Secret of the BaaS where you wish to install the sandbox
UGCLIENTSECRET=