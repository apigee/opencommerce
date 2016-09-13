<a href="https://pages.apigee.com/ebook-State-of-APIs-in-Retail-reg.html?utm_source=github&utm_content=state-of-apis-retail"><img src="http://opencommerce.apigee.com/sites/default/files/state_of_apis_report_1.0.png"/></a>
===================

<a href="http://apigee.com/"><img src="http://apigee.com/about/sites/all/themes/apigee_themes/apigee_mktg/images/logo.png"/></a> Open Commerce
===================

Digital Services in Retail Space
-------------

Before we delve into the specifics of the Solution it may be worthwhile to note the transformation happening currently in the retail space. Digital is positing itself in many facets and interactions that a consumer has with the Retail companies.

![Commerce Solution Overview](http://opencommerce.apigee.com/sites/default/files/retail-header_0.png)

Overview
-------------

Apigee OpenCommerce Solution enables retailers to accelerate  development of digital services. OpenCommerce is built on Apigee Edge API Management Platform, and features:

> - Product APIs.
> - Product Collection APIs
> - Search APIs
> - Carts APIs
> - Order APIs
> - Store APIs
> - Recommendation APIs
> - Promotion APIs

It also provides an implementation of OpenID and oAuth based user authentication and consent.

These APIs play a critical role in the digital transformation of retail services as represented below:


![OpenCommerce Overview](http://opencommerce.apigee.com/sites/default/files/opencommerce_architecture.png)


## Repository Overview
This repository contains the necessary artifacts that will allow one to pull up a complete set of **Commerce APIs**. In addition this will also allow one to build a _sandbox_ complete with a **Developer Portal** (https://opencommerce.apigee.com/), mock backend and a sample app.

## Prerequisite
+ Apigee API Management Developer Account
+ Apigee API BaaS Account
+ Apigee Developer Portal (https://opencommerce.apigee.com/)

## Setup
To deploy the APIs and its dependencies on your own org please run the following script

```bash
$ cd src/gateway/setup
$ sh setup.sh
```

This will interactively prompt you for your Edge and BaaS credentials, and will then create / deploy all relevant bundles and artifacts and will provision the **OpenCommerce Sandbox** on your own Org.

In case you wish to run in a non interactive mode, a config.sh file is available in this (/setup) folder which allows one to specify defaults to the asked questions. This will ensure that the questions are not asked where it is available in the config.sh file.
  
  The available defaults are 
  
  ```bash
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
  ```

## Support
This is an open-source project of the Apigee Corporation. It is not covered by Apigee support contracts. However, we will support you as best we can. For help, please open an issue in this GitHub project. You are also always welcome to submit a pull request.

## Design
The APIs provided are configurable to connect to your own Commerce backend and / or provide your own consent apps. The following sections will help you understand this solution so that you can go about this on your own.

### Architecture
![API Architecture](http://opencommerce.apigee.com/sites/default/files/api_design.png)

The Commerce APIs are designed as Northbound + Southbound APIs.

The Northbound API provides a fixed set of interfaces that can be consumed by the external consumers. In order to minimize changes to the contract, this API will not need to be changed once deployed.

The Southbound API connects to the actual backend of the commerce system (or the mock backend) and provides the data that is exposed by the _Northbound APIs_
When the API Developer has to make any changes to the APIs (specifically to connect to a different backend), then these are the APIs that need to be modified.

All **Southbound APIs** end with the suffix _'-connector'_

In addition, there are some internal APIs which are not exposed outside, but which are used internally from the other APIs and provide common service such as sending out SMS, storing and fetching session data etc.

### Authentication

Accessing the the APIs require a valid Oauth access token to be passed in the `Authorization` header, as `Authorization: Bearer <token>` .

The tokens can be obtained using:

1) <a href = "https://opencommerce.apigee.com/oauth/apis/post/token"> Oauth Client Credentials authentication </a> - only the non-user specific APIs like products, collections, store and search can be accessed using this token.

2) <a href = "https://opencommerce.apigee.com/oauth/apis/get/authorize"> Open ID based user authentication and consent </a> - the APIs that require user data like orders & carts and also the non-user specific APIs can be accessed using this token.

The apps that access the commerce APIs can be classified as:

1) **Trusted Apps**:  Either First party App or limited set of third party trusted apps.  They could access all the APIs using client credentials and for APIs that require user-data, the user-id could be passed as a parameter.

2) **Untrusted Apps**: All other apps, would have to use OpenID based user authentication for accessing APIs that require user data and Client Credentials authentication for non-user specific APIs.

### Consent App
The consent app is a key part in helping the user securely authenticate with the retail services. The consent app is a trusted app of the retail services will allow the user to login and subsequently provide consent information.

In this sandbox, the consent app will talk to the following APIs in order to fulfill its functionality
+ Session API
+ Authention-connector API

In order to customize the consent app, or in case one or more components delivered along with the sandbox is changed, then the configuration of the consent app needs to be updated.

The consent app has a _config.json_ file available in the `src/gateway/consent-app/apiproxy/resources/node/` folder. This json file has to be customized so that the right API endpoints are provided to the consent app.


### Sequence Diagram
#### OAuth API Flow

![OAuth API Interaction](http://opencommerce.apigee.com/sites/default/files/open_commerce_api_common_flow.png)



### APIs

#### External APIs
##### Locations API
##### Product APIs.
##### Product Collection APIs
##### Search APIs
##### Carts APIs
##### Order APIs
##### Store APIs
##### Recommendation APIs
##### Promotion APIs


#### Supporting APIs
##### Session API

#### Internal APIs
##### Authentication Connector





