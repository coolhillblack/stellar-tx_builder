# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.1.x   | ✅        |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, open a private security advisory via GitHub's "Security" tab on the repository.

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You will receive a response within 72 hours. If confirmed, we will release a patch as soon as possible.

## Security Notes

- Secret keys entered into the signing step are **never transmitted** — all signing is done in-browser using the Stellar JavaScript SDK.
- We do not store, log, or send any key material anywhere.
- This library communicates only with Horizon (the Stellar API) for account lookups and transaction submission.
