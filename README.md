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
This repository contains the necessary artifacts that will allow one to pull up a complete set of **Commerce APIs**. In addition this will also allow one to build a _sandbox_ complete with a **Developer Portal**, mock backend and a sample app.

## Prerequisite
+ Apigee API Management Developer Account
+ Apigee API BaaS Account
+ Apigee Developer Portal

## Setup
To deploy the APIs and its dependencies on your own org please run the following script

```bash
$ cd src/gateway
$ sh setup/setup.sh
```

This will interactively prompt you for your Edge and BaaS credentials, and will then create / deploy all relevant bundles and artifacts and will provision the **OpenCommerce Sandbox** on your own Org.

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

### Sequence Diagram
#### OAuth API Flow
![OAuth API Interaction](http://opencommerce.apigee.com/sites/default/files/open_commerce_api_common_flow.png)

#### Transfers API Flow

### Consent App
The consent app is a key part in helping the user securely authenticate with the retail services. The consent app is a trusted app of the retail services will allow the user to login and subsequently provide consent information.

In this sandbox, the consent app will talk to the following APIs in order to fulfill its functionality
+ Session API
+ Authention-connector API

In order to customize the consent app, or in case one or more components delivered along with the sandbox is changed, then the configuration of the consent app needs to be updated.

The consent app has a _config.json_ file available in the `src/gateway/consent-app/apiproxy/resources/node/` folder. This json file has to be customized so that the right API endpoints are provided to the consent app.

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





