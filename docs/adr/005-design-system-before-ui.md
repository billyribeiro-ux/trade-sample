# ADR 005: Define Design Tokens Before UI

## Status

Accepted

## Context

The product must feel premium, restrained, and consistent. UI implementation
should not invent colors, radii, type scales, or spacing ad hoc.

## Decision

Create design tokens before building pages. Use OKLCH color, fluid type,
8px-based spacing, restrained radius, and visible focus states.

## Consequences

The UI starts from shared constraints. Visual changes should update tokens or
document a specific exception.

