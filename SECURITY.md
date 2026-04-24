# Security Policy

## Supported Versions

Security fixes are applied to the active production release.

## Reporting a Vulnerability

Email security concerns to the project owner. Do not open public issues for
suspected vulnerabilities.

Include:

- Affected route, endpoint, or workflow.
- Reproduction steps.
- Expected and actual behavior.
- Any logs, request IDs, or screenshots that help triage.

## Security Principles

- Server-authoritative auth, billing, entitlement, and download checks.
- No secrets committed to git.
- Short-lived signed download URLs.
- Idempotent webhook processing.
- Audit logging for admin and sensitive user actions.

