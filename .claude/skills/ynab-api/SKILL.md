---
name: ynab-api
description: YNAB (You Need A Budget) API documentation for building budget management integrations
---

# YNAB API Skill

Comprehensive documentation for the YNAB (You Need A Budget) REST API, enabling developers to build budget management integrations, personal finance tools, and third-party applications that interact with YNAB budgets.

## Overview

The YNAB API is a REST-based API that uses JSON data format and is secured with HTTPS. It supports Cross-Origin Resource Sharing (CORS), allowing direct usage from web applications. The base URL is `https://api.ynab.com/v1`.

**Key Characteristics:**
- REST-based architecture with JSON responses
- HTTPS/TLS enforced on all requests
- CORS support for browser-based applications
- Rate limited to 200 requests per hour per access token
- Supports both read-only and write operations

## When to Use This Skill

This skill should be triggered when:

### Budget & Account Management
- Retrieving budget information and account balances
- Listing or creating transactions
- Managing categories and category balances
- Working with payees and scheduled transactions
- Fetching monthly budget data

### Authentication & Integration
- Setting up YNAB API authentication (Personal Access Tokens or OAuth)
- Implementing OAuth flows (Implicit Grant or Authorization Code Grant)
- Building third-party applications that integrate with YNAB
- Configuring read-only vs. read-write access scopes

### Data Synchronization
- Implementing delta requests for efficient data syncing
- Working with `server_knowledge` for incremental updates
- Caching strategies for YNAB data
- Handling milliunits currency format conversion

### Error Handling & Best Practices
- Debugging API errors and HTTP status codes
- Understanding rate limiting (429 errors)
- Handling API response formats and error objects

## Key Concepts

### Authentication Methods

**Personal Access Tokens**
- Best for individual developers accessing their own account
- Created in Account Settings > Developer Settings
- Never expires but can be revoked
- Should be treated like a password - never share

**OAuth Applications**
- Required for applications used by multiple users
- Two grant types supported:
  - **Implicit Grant** (client-side): For browser/mobile apps, tokens expire in 2 hours, no refresh tokens
  - **Authorization Code Grant** (server-side): For secure server apps, supports refresh tokens
- New OAuth apps start in Restricted Mode (25 user limit until reviewed)

### Milliunits Currency Format

YNAB uses "milliunits" for all currency amounts - 1,000 milliunits = 1 unit of currency:

| Display Amount | Milliunits Value |
|---------------|------------------|
| $1.00         | 1000            |
| $25.50        | 25500           |
| -$10.25       | -10250          |
| $0.01         | 10              |

### Delta Requests (Incremental Sync)

Endpoints that support delta requests return a `server_knowledge` number. Pass this as `last_knowledge_of_server` query parameter to receive only changed data since your last request.

**Supported endpoints:**
- `GET /budgets/{budget_id}`
- `GET /budgets/{budget_id}/accounts`
- `GET /budgets/{budget_id}/categories`
- `GET /budgets/{budget_id}/months`
- `GET /budgets/{budget_id}/payees`
- `GET /budgets/{budget_id}/transactions`
- `GET /budgets/{budget_id}/scheduled_transactions`

### Date Format

All dates use ISO 8601 (RFC 3339 "full-date") format in UTC timezone.
Example: December 30, 2015 = `2015-12-30`

## Quick Reference

### Authentication - Bearer Token (Recommended)

Send the access token in the Authorization header:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" https://api.ynab.com/v1/budgets
```

### Authentication - Query Parameter (Alternative)

```bash
curl "https://api.ynab.com/v1/budgets?access_token=<ACCESS_TOKEN>"
```

### OAuth Implicit Grant Flow (Client-Side)

Redirect users to authorize your application:

```
https://app.ynab.com/oauth/authorize?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=token
```

User will be redirected back with the token in the URL fragment:

```
https://yourapp.com/#access_token=8bc63e42-1105-11e8-b642-0ed5f89f718b
```

### OAuth Authorization Code Grant Flow (Server-Side)

Step 1 - Redirect user to authorize:

```
https://app.ynab.com/oauth/authorize?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=code
```

Step 2 - Exchange code for token (server-side POST request to YNAB).

### Read-Only OAuth Scope

Request read-only access by adding the scope parameter:

```
https://app.ynab.com/oauth/authorize?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=token&scope=read-only
```

### CSRF Protection with State Parameter

Include a unique state parameter to prevent CSRF attacks:

```
https://app.ynab.com/oauth/authorize?client_id=[CLIENT_ID]&redirect_uri=[REDIRECT_URI]&response_type=token&state=4cac8f43
```

The same `state` value will be returned to your redirect URI for verification.

### Default Budget Selection

If enabled for your OAuth app, use `default` instead of a budget_id:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" https://api.ynab.com/v1/budgets/default/accounts
```

### Delta Request Example

Initial request returns server_knowledge:

```json
{
  "data": {
    "server_knowledge": 100,
    "budget": {
      "id": "16da87a0-66c7-442f-8216-a3daf9cb82a8"
    }
  }
}
```

Subsequent request with delta:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" \
  "https://api.ynab.com/v1/budgets/{budget_id}?last_knowledge_of_server=100"
```

Response contains only changed entities:

```json
{
  "data": {
    "server_knowledge": 101,
    "budget": {
      "accounts": [
        {
          "id": "ea0c0ace-1a8c-4692-9e1d-0a21fe67f10a",
          "name": "Renamed Checking Account",
          "type": "Checking",
          "on_budget": true,
          "closed": false,
          "note": null,
          "balance": 20000
        }
      ]
    }
  }
}
```

### Response Format - Success

```json
{
  "data": {
    "budgets": [
      {
        "id": "budget-id-here",
        "name": "My Budget"
      }
    ]
  }
}
```

### Response Format - Error

```json
{
  "error": {
    "id": "error-id",
    "name": "error_name",
    "detail": "Detailed error message"
  }
}
```

### Rate Limit Error (429)

When exceeding 200 requests/hour:

```json
{
  "error": {
    "id": "429",
    "name": "too_many_requests",
    "detail": "Rate limit exceeded"
  }
}
```

## Common API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/budgets` | GET | List all budgets |
| `/budgets/{budget_id}` | GET | Get a single budget |
| `/budgets/{budget_id}/accounts` | GET | List accounts |
| `/budgets/{budget_id}/accounts/{account_id}` | GET | Get single account |
| `/budgets/{budget_id}/categories` | GET | List categories |
| `/budgets/{budget_id}/categories/{category_id}` | GET | Get single category |
| `/budgets/{budget_id}/months` | GET | List budget months |
| `/budgets/{budget_id}/months/{month}/categories/{category_id}` | GET | Get category for month |
| `/budgets/{budget_id}/payees` | GET | List payees |
| `/budgets/{budget_id}/payees/{payee_id}` | PATCH | Update payee name |
| `/budgets/{budget_id}/transactions` | GET | List transactions |
| `/budgets/{budget_id}/transactions` | POST | Create transaction(s) |
| `/budgets/{budget_id}/transactions/{transaction_id}` | GET | Get single transaction |
| `/budgets/{budget_id}/scheduled_transactions` | GET | List scheduled transactions |
| `/budgets/{budget_id}/scheduled_transactions` | POST | Create scheduled transaction |

## Official Libraries

### JavaScript/TypeScript (Official)
- npm: `ynab`
- GitHub: Official YNAB JavaScript SDK
- Works server-side (Node.js) and client-side (browsers)

```bash
npm install ynab
```

### Ruby (Official)
- RubyGems: `ynab`
- GitHub: Official YNAB Ruby SDK

```bash
gem install ynab
# or add to Gemfile: gem 'ynab'
```

### Python (Official)
- PyPi: `ynab`
- GitHub: Official YNAB Python SDK

```bash
pip install ynab
```

## Reference Files

This skill includes comprehensive documentation in `references/`:

### endpoints.md
*Source: Official YNAB API Documentation | Confidence: Medium*

Complete API reference including:
- Authentication methods (Personal Access Tokens & OAuth)
- OAuth grant types and flows
- API usage guidelines and best practices
- Delta requests and incremental sync
- Rate limiting details
- Response formats and error handling
- Currency (milliunits) and date formats
- Official library documentation
- Changelog and version history
- Legal terms and OAuth application requirements

## Working with This Skill

### For Beginners
1. Start with obtaining a **Personal Access Token** from your YNAB Account Settings
2. Test basic API calls using curl with the Bearer token
3. Try listing your budgets: `GET /budgets`
4. Explore the YNAB API Starter Kit for a working example

### For Application Developers
1. Review OAuth requirements and terms of service
2. Choose the appropriate OAuth grant type for your use case
3. Implement proper error handling for rate limits and API errors
4. Use delta requests for efficient data synchronization
5. Consider using official libraries (JavaScript, Ruby, Python)

### For Advanced Users
1. Implement incremental sync using `server_knowledge`
2. Handle milliunits conversion for currency display
3. Build efficient caching strategies respecting rate limits
4. Use read-only scope when write access isn't needed

## Best Practices

### Performance & Efficiency
- **Use delta requests**: Always use `last_knowledge_of_server` for repeated requests
- **Be specific**: Request single resources instead of full lists when possible
- **Cache data**: Store responses locally to minimize API calls
- **Respect rate limits**: 200 requests per hour per token

### Security
- **Never share tokens**: Personal Access Tokens should be treated like passwords
- **Use HTTPS only**: The API enforces TLS
- **Implement state parameter**: Prevent CSRF attacks in OAuth flows
- **Request minimal scope**: Use read-only scope when write access isn't needed

### Error Handling
- **Anticipate failures**: Build resilience for connection issues and outages
- **Handle 429 errors**: Implement backoff when rate limited
- **Check response codes**: API uses meaningful HTTP status codes

## OAuth Application Requirements

For applications used by other YNAB users:

1. **Privacy Policy Required**: Must be published and displayed to users
2. **Restricted Mode**: New apps limited to 25 users until reviewed
3. **Review Process**: Takes 2-4 weeks to remove restrictions
4. **Naming Rules**: Cannot include "YNAB" unless preceded by "for"
   - Acceptable: "Budget Tools for YNAB"
   - Unacceptable: "YNAB Tools"
5. **Data Handling**: Must disclose how user data is used, stored, and secured
6. **No Credential Storage**: Never store user passwords, only OAuth tokens

## Support & Resources

- **API Support**: api@ynab.com (response time up to 1 week)
- **Official Documentation**: https://api.ynab.com/
- **YNAB API Starter Kit**: Reference implementation for OAuth flows
- **Works with YNAB**: Gallery of community-built applications

## Notes

- This skill was synthesized from official YNAB API documentation
- The API moved from `api.youneedabudget.com` to `api.ynab.com` in 2023
- Old URLs continue to work but should be updated
- API is currently at version "v1"
- Documentation last updated: May 28, 2025

## Updating

To refresh this skill with updated documentation:
1. Re-run the scraper with the same configuration
2. The skill will be rebuilt with the latest information
3. Check the YNAB API changelog for recent changes
