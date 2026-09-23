# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Frontend Mentor "GitHub user search app" challenge, built with **Spec-Driven Development (SDD)**. The two governing documents are:

- `my-sdd-docs/constitution.md` — non-negotiable rules (tech stack, code style, error handling, AI behavior, versioning).
- `my-sdd-docs/specs.md` — the feature spec, architecture, testing, docs, deployment, and post-implementation workflow.

Read both before making changes. Per the constitution: **build only what `specs.md` documents (no "just in case" features)**, and if a user instruction contradicts the constitution/spec or you detect a logical flaw, **stop, explain the issue, and ask for `specs.md` to be updated before touching source code**.

Note: the parent directory's `CLAUDE.md`/`AGENTS.md` is Frontend Mentor's generic "mentor mode" (hints only, no code). This repo's SDD docs direct Claude to implement the app, so they take precedence here.

## Current state

Implemented. The Spec Kit artifacts for the feature are in `specs/001-github-user-search/` (spec, plan, research, data model, contracts, quickstart, tasks), and `.specify/memory/constitution.md` restates `my-sdd-docs/constitution.md`. The starter icons now live in `src/assets/`, and the favicon is in `public/`. Linting uses oxlint (the Vite template default). The GitHub remote `origin` is `gusanchefullstack/fsdev-github-user-search-app`.

## Target stack and structure (from the SDD docs)

- React + TypeScript, built/served with **Vite**; tests with **Vitest**.
- `index.html` stays at the project root (Vite entry) and references the entry point in `src/`.
- All source under `src/`, with CSS and TS in their own subfolders and React function components in a components folder.
- Styling via **CSS Modules**. Fonts, colors, gradients, and typography must be parameterized as variables in a **separate file**.
- Naming: `camelCase` for functions/variables, `PascalCase` for interfaces/types/classes. Keep it plain; avoid overengineering.
- Frontend-only (no backend/DB for this app).

Once scaffolded, the expected commands are the Vite/Vitest defaults (`npm run dev`, `npm run build`, `npm test`, and `npx vitest run <file>` or `-t "<name>"` for a single test). Check `package.json` for the real scripts.

## Data and behavior

- API: `GET https://api.github.com/users/:username` (unauthenticated, so rate-limited).
- On first load show `octocat`. If the user isn't found, show the inline error from the design.
- No `name`: show `login` in the name slot and `@login` below it.
- Empty bio: "This profile has no bio" (reduced opacity). Empty location/website/twitter/company: "Not Available" (reduced opacity).
- Website, twitter, and company render as links. Company strips the leading `@` and links to `https://github.com/<company>`.
- Light/dark theme toggle, defaulting to `prefers-color-scheme`.
- Never show raw errors or stack traces; map every failure to a friendly message.

## Design source of truth

- `figma-design/*.fig` (gitignored; **never commit design files**) is the source of truth for spacing, fonts, colors, and the mobile, tablet, and desktop layouts. Read it via the Figma Desktop MCP using the node URLs in `specs.md` (Design System `node-id=1-69`, layouts `node-id=1-704`).
- Use the icons in `src/assets/` first, and export from Figma only if one is missing.

## Accessibility and HTML rules (enforced by the spec)

Use semantic landmarks, exactly one `<main>`, exactly one `<h1>`, and no multiple links with identical accessible text (e.g. give each profile link a distinct accessible name). Every interactive element needs a hover state.

## Testing and verification

Use Vitest for key and edge cases (missing name, bio, or links; company `@` stripping; user not found; network failure). Visually verify at **375px, 768px, and 1440px** viewports.

## Workflow after implementation (see `specs.md` for details)

1. Screenshots at exactly 375px and 1440px go in `/screenshots`. Embed them in the README with the 375px image at 40% of the 1440px width.
2. Write the README from `README-template.md` (plus the `create-readme` skill). Put the author links from `specs.md` in the Author section as inline badges.
3. The GitHub repo name must be prefixed `fsdev-`. Deploy to Vercel only after the user confirms the project is done.
4. Submit with the `frontendmentor-submitter` agent, then add the solution and live URLs to the README and the repo homepage.
5. Update the portfolio with the `landing-page-portfolio-updater` agent, **asking the user for confirmation first**.
6. Fix quality-report issues with the `frontend-mentor-issue-fixer` agent.
