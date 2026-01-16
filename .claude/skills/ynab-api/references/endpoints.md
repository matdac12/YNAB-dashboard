# Ynab-Api - Endpoints

**Pages:** 1

---

## Hello Developers

**URL:** https://api.ynab.com/

**Contents:**
      - Authentication
      - Usage
      - Libraries
      - Works with YNAB
      - Legal
      - Changelog
  - Hello Developers
  - Quick Start
- Authentication
  - Overview

Welcome to the YNAB API!

(If you aren't a developer or you have no idea what an "API" is and you just want to sign in to your YNAB account, you can do that here.)

The YNAB API is REST based, uses the JSON data format and is secured with HTTPS. You can use it to build a personal application to interact with your own budget or build an application that any other YNABer can authorize and use. Be sure to check out what other YNABers have built in the Works with YNAB section.

You can check our changelog to find out about updates and improvements to the API.

For support, email api@ynab.com. Because our team is small, we may need up to a week to respond. Support for the API is limited, and we cannot provide detailed coding assistance.

If you're the type of person who just wants to get up and running as quickly as possible and then circle back to fill in the gaps, these steps are for you:

You should get a response that looks something like this:

That's it! You just received a list of your budgets in JSON format through the YNAB API. Hooray!

If you want to start working with the API to build something more substantial, you might want to check out our YNAB API Starter Kit which is a simple, but functional web application that uses the API.

All API resources require a valid access token for authentication. There are two ways to obtain access tokens: Personal Access Tokens and OAuth Applications.

Personal Access Tokens are access tokens created by an account owner and are intended to be used only by that same account owner. They should not be shared and are intended for individual usage scenarios. They are a convenient way to obtain an access token without having to use a full OAuth authentication flow. If you are an individual developer and want to simply access your own account through the API, Personal Access Tokens are the best choice.

To obtain a Personal Access Token, sign in to your account, go to "Account Settings", scroll down and navigate to "Developer Settings" section. From the Developer Settings page, click "New Token" under the Personal Access Tokens section, enter your password and you will be presented with a new Personal Access Token. You will not be able to retrieve the token later so you should store it in a safe place. This new token will not expire but can be revoked at any time from this same screen.

You should not share this access token with anyone or ask for anyone else's access token. It should be treated with as much care as your main account password.

OAuth is a secure way for a third-party application to obtain delegated but limited permissions to a user account and is appropriate for use in applications that need to gain limited authorized permissions to accounts they do not own. If you are developing an application that uses the API and want other users to be able to use your application, OAuth is the only option for obtaining access tokens for other users.

All OAuth Application integrations must abide by the API Terms of Service and the OAuth Application Requirements. Failure to do so will result in disabling of the application.

When an OAuth application is created, it will be placed in Restricted Mode initially. This means the application will be limited to obtaining 25 access tokens for users other than the OAuth application owner. Once this limit is reached, a message will be placed on the Authorization screen and new authorizations will be prohibited.

To have Restricted Mode removed, you must request a review via this form. Your OAuth application will need to abide by the API Terms of Service and the OAuth Application Requirements. Once we review the application and confirm adherence to our policies, we will remove Restricted Mode and send you an email confirmation. This process takes 2-4 weeks.

To create an OAuth Application, sign in to your account, go to "Account Settings", scroll down and navigate to "Developer Settings" section. From the Developer Settings page, click "New Application" under the OAuth Applications section. Here, you specify the details of your application and save it. After saving, you will see the details of the new application, including the Client ID and the Client Secret which are referenced in the instructions below.

After creating the application, you are then able to use one of the supported grant types to obtain a valid access token. The YNAB API supports two OAuth grant types: Implicit Grant and Authorization Code Grant.

The Implicit Grant type, also informally known as the "client-side flow", should be used in scenarios where the application Secret cannot be kept private. The application Secret should never be visible or accessible by a client! If you are requesting an access token directly from a browser or other client that is not secure (i.e. mobile app) this is the flow you should use. This grant type does not support refresh tokens so once the access token expires 2 hours after it was granted, the user must be prompted again to authorize your application.

The YNAB API Starter Kit implements the Implicit Grant Flow and can be a good starting point for your own project or used as a reference for implementing OAuth.

Here is the flow to obtain an access token:

The Authorization Code Grant type, also informally known as the "server-side flow", is intended for server-side applications, where the application Secret can be protected. If you are requesting an access token from a server application that is private and under your control, this grant type can be used. This grant type supports refresh tokens so once the access token expires 2 hours after it was granted, the application can request a new access token without having to prompt the user to authorize again.

Here is the flow to obtain an access token:

The access_token, which can be used to authenticate through the API, will be included in the token response which will look like this:

When an OAuth application is requesting authorization, a scope parameter with a value of read-only can be passed to request read-only access to a budget. For example: https://app.ynab.com/oauth/authorize?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=token&scope=read-only. If an access token issued with the read-only scope is used when requesting an endpoint that modifies the budget (POST, PATCH, etc.) a 403 Forbidden response will be issued. If you do not need write access to a budget, please use the read-only scope.

An optional, but recommended, state parameter can also be supplied to prevent Cross Site Request Forgery (CSRF) attacks. If specified, the same value will be returned to the [REDIRECT_URI] as a state parameter. For example: if you included parameter state=4cac8f43 in the authorization URI, when the user is redirected to [REDIRECT_URI], the URL would contain that same value in a state parameter. The value of state should be unique for each request.

An OAuth application can optionally have 'default budget selection' enabled.

When default budget selection is enabled, a user will be asked to select a default budget when authorizing your application:

You can then pass in the value 'default' in lieu of a budget_id in endpoint calls. For example, to get a list of accounts on the default budget you could use this endpoint: https://api.ynab.com/v1/budgets/default/accounts.

Once you have obtained an access token, you must use HTTP Bearer Authentication, as defined in RFC6750, to authenticate when sending requests to the API. We support Authorization Request Header and URI Query Parameter as means to pass an access token.

The recommended method for sending an access token is by using an Authorization Request Header where the access token is sent in the HTTP request header.

An access token can also be passed as a URI query parameter named "access_token":

Our API uses a REST based design, leverages the JSON data format, and relies upon HTTPS for transport. We respond with meaningful HTTP response codes and if an error occurs, we include error details in the response body. We support Cross-Origin Resource Sharing (CORS) which allows you to use the API directly from a web application.

The current version of the API ("v1") is mostly read-only, supporting GET requests. However, we do support some POST, PATCH, and DELETE requests on several resources. Take a look at the API Endpoints for details.

TLS (a.k.a. SSL or HTTPS) is enforced on all requests to ensure communication from your client to our endpoint is encrypted, end-to-end. You must obtain an access token and provide it with each request. An access token is tied directly to a YNAB account but can be independently revoked.

Please cache data received from the API when possible to avoid unnecessary traffic.

Some endpoints support Delta Requests, where you can request to receive only what has changed since the last response. It is highly recommended to use this feature as it reduces load on our servers as well as makes processing responses more efficient.

Errors and exceptions will sometimes happen. You might experience a connection problem between your app and the YNAB API or a complete outage. You should always anticipate that errors or exceptions may occur and build in accommodations for them in your application.

You should use the most specific request possible to avoid large responses which are taxing on the API server and slower for your app to consume and process. For example, if you want to retrieve the balance for a particular category, you should request that single category from /budgets/{budget_id}/categories/{category_id} rather than requesting all categories.

The base URL is: https://api.ynab.com/v1. To see a list of all available endpoints, please refer to our API Endpoints page. The documentation also lets you "try it out" on each endpoint directly within the page.

Note: The YNAB API was previously available at https://api.youneedabudget.com/v1. In 2023 it moved to https://api.ynab.com/v1. While existing applications using https://api.youneedabudget.com/v1 will continue to function, all API consumers should be updated to use https://api.ynab.com/v1.

All responses from the API will come with a response wrapper object to make them predictable and easier to parse.

Successful responses will return wrapper object with a data property that will contain the resource data. The name of the object inside of the data property will correspond to the requested resource.

For example, if you request /budgets, the response will look like:

If you request a single account from /accounts/{account_id}:

Response data properties that have no data will be specified as null rather than being omitted. For example, a transaction that does not have a payee would have a body that looks like this:

For error responses, the HTTP Status Code will be specified as something other than 20X and the body of the response will contain an error object. The format of an error response is:

The Errors section lists the possible errors.

Errors from the API are indicated by the HTTP response status code and also included in the body of the response, according to the response format. The following errors are possible:

Currency amounts returned from the API—such as account balance, category balance, and transaction amounts— use a format we call "milliunits". Most currencies don't have three decimal places, but you can think of it as the number of thousandths of a unit in the currency: 1,000 milliunits equals "one" unit of a currency (one Dollar, one Euro, one Pound, etc.). Here are some concrete examples:

All dates returned in response calls use ISO 8601 (RFC 3339 "full-date") format. For example, December 30, 2015 is formatted as 2015-12-30.

All dates use UTC as the timezone.

The following API resources support "delta requests", where you ask for only those entities that have changed since your last request: GET /budgets/{budget_id} GET /budgets/{budget_id}/accounts GET /budgets/{budget_id}/categories GET /budgets/{budget_id}/months GET /budgets/{budget_id}/payees GET /budgets/{budget_id}/transactions GET /budgets/{budget_id}/scheduled_transactions

We recommend using delta requests as they allow API consumers to parse less data and make updates more efficient, and decreases server load on our end.

Resources supporting delta requests return a server_knowledge number in the response. This number can then be passed in as the last_knowledge_of_server query parameter. Then, only the data that has changed since the last request will be included in the response.

For example, if you request a budget's contents from /budgets/{budget_id}, it will include the server_knowledge like so: { "data": { "server_knowledge": 100, "budget": { "id": "16da87a0-66c7-442f-8216-a3daf9cb82a8", ... } } }

On a subsequent request, you can pass that same server_knowledge in as a query parameter named last_knowledge_of_server (/budgets/{budget_id}?last_knowledge_of_server=100) and get back only the entities that have changed since your last request. For example, if a single account had its name changed since your last request, the response would look something like: { "data": { "server_knowledge":101, "budget":{ ... "accounts": [ { "id":"ea0c0ace-1a8c-4692-9e1d-0a21fe67f10a", "name":"Renamed Checking Account", "type":"Checking", "on_budget":true, "closed":false, "note":null, "balance":20000 } ], ... } } }

An access token may be used for up to 200 requests per hour.

The limit is enforced within a rolling window. If an access token is used at 12:30 PM and for 199 more requests up to 12:45 PM and then hits the limit, any additional requests will be forbidden until enough time has passed for earlier requests to fall outside of the preceding one-hour window.

If you exceed the rate limit, an error response returns a 429 error:

The JavaScript library is available via npm and the source and documentation is located on GitHub. This library can be used server-side (Node.js) or client-side (web browser) since we support Cross-Origin Resource Sharing (CORS).

If you are using the JavaScript library, you might want to also take a look at the YNAB API Starter Kit which is a simple, but functional web application that uses the JavaScript library.

The Ruby library is available via RubyGems and the source and documentation is located on GitHub.

If using Bundler, add gem 'ynab' to your Gemfile and then run bundle.

The Python library is available via PyPi and the source and documentation is located on GitHub.

The following libraries have been created and are maintained by YNABers. We do not provide support for these clients but appreciate the effort!

These libraries are not affiliated, associated, or officially connected with YNAB or any of its subsidiaries of affiliates. Please review their respective privacy policies, as they may differ from ours. YNAB is not responsible and cannot be held liable for any potential data breaches that may occur from their use. By adding any of these tools, you assume any associated risks.

The following applications are official YNAB integrations that we developed and support.

The following third party applications have been developed by the YNAB community. We do not provide support for these applications. If you have built an OAuth application you'd like shared here, see OAuth Applications.

We provide the YNAB API so that YNAB-loving developers can make really cool projects and applications. We have some expectations and guidelines about how you’ll do that. Officially, these guidelines are our API Terms of Service because, well, that’s what they’re called. They work hand-in-hand with our general YNAB Terms of Service, the YNAB Privacy Policy, and all apply to your use of the API. By accessing or using our APIs, you are agreeing to these terms. We appreciate you reading them carefully and, naturally, following them.

To keep the text here readable, we refer to the following as the “Terms”:

In order to protect the website, our apps, and our customers and their data, you agree to comply with them and that they govern your relationship with us.

With that said, here are the YNAB API Terms of Service:

In addition to the above terms, OAuth Applications must adhere to these requirements: You must publish a privacy policy that is displayed to users. There are sites like Terms Feed that can assist with drafting a privacy policy. We do not represent, warrant, or guarantee that the language provided by the Terms Feed privacy policy generator will ensure compliance with data privacy laws. You may consult a lawyer at your own expense if you need guidance. YNAB is not responsible for reviewing your Privacy Policy and determining whether it is compliant with all applicable privacy laws. YNAB is also not responsible for any other policies on your site. Your privacy policy must include, but is not limited to, the following: You must be honest and transparent with users about the purpose for which you use their data. If you collect data for two purposes, you must disclose what those two purposes are. Your use of YNAB user data must be limited to the practices disclosed in your privacy policy. A clear explanation of how the data obtained through the YNAB API will be handled, stored, secured, and how long it will be kept, which must be accurate and comprehensive. It must thoroughly disclose how your application accesses, users, stores, or shares YNAB user data. A guarantee that the data obtained through the YNAB API will not unknowingly be passed to any third party. A method for users to delete their data if they request it (can be a contact email). You must delete user data if they request. A "Last Updated" date If you access or use a type of data not originally disclosed in your privacy policy when a YNAB user initially authorized access or if you change the way your application uses YNABer data, you must update your privacy policy and prompt the user to consent to any changes before you may access the data. Display the privacy policy URL in your OAuth client configuration when your application is publicly available and ensure that it is prominently displayed in your application interface so that users can find this information easily. Only request the minimum necessary permissions to run your application, features, or services and don’t request access to information that you don’t need. Request access in context, via incremental authorization, wherever possible. Do not engage in any activity that may deceive, misrepresent, or lead to unauthorized use of YNAB’s API. Do not (1) misrepresent the data you collect or what you use with user data, (2) access, aggregate, or analyze YNAB user data if the data will be sold to a third party, (3) mislead us about your application’s operating environment, (4) use undocumented APIs without express written permission, and (5) make false or misleading statements about any entities that have authorized or managed your application. The application must not directly request, handle or store any financial account credentials other than an access token obtained directly from a financial institution using OAuth. Maintain a secure operating environment. In line with the Attribution & Intellectual Property section of the API Terms of Service above: The application and the web address (DNS name) must not include "YNAB" or "You Need A Budget" unless preceded by the word "for". Acceptable: "Budget Tools", "Transaction Syncer", "Currency Tools for YNAB". Unacceptable: "YNAB Tools", "YNAB Transaction Syncer", "Advanced YNAB". Any graphics or artwork may not be modifications to our official branding and must be distinguishable from YNAB itself and/or from YNAB’s graphics or artwork.

Last updated: May 28, 2025

When a 429 Too Many Requests response is returned because the Rate Limit has been exceeded, a X-Rate-Limit response header is no longer included.

Add ability to fetch transactions for a specific month.

Add support for creating scheduled transactions.

Add goal_needs_whole_amount to all category responses. This field indicates the monthly rollover behavior for NEED-type goals. When "true", the goal will always ask for the target amount in the new month ("Set Aside"). When "false", previous month category funding is used ("Refill"). For other goal types, this field will be null.

Add ability to update a payee's name

Remove server_knowledge field from single category resource responses (GET budgets/{budget_id}/months/{month}/categories/{category_id} and GET budgets/{budget_id}/categories/{category_id}). These endpoints do not support delta requests and the server_knowledge field has been mistakenly included in their responses.

Various new features and enhancements.

Initial release of the YNAB API.

**Examples:**

Example 1 (typescript):
```typescript
curl -H "Authorization: Bearer <ACCESS_TOKEN>" https://api.ynab.com/v1/budgets
```

Example 2 (yaml):
```yaml
https://app.ynab.com/oauth/authorize?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=token
```

Example 3 (yaml):
```yaml
https://quantumspending.com/#access_token=8bc63e42-1105-11e8-b642-0ed5f89f718b
```

Example 4 (yaml):
```yaml
https://app.ynab.com/oauth/authorize?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=code
```

---
