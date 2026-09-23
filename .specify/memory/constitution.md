<!--
Sync Impact Report
- Version change: (unfilled template) → 1.0.0
- Source: my-sdd-docs/constitution.md (sections 1–8), restated in Spec Kit template structure
- Principles defined:
  - [PRINCIPLE_1_NAME] → I. Design Fidelity (Figma Is the Source of Truth)
  - [PRINCIPLE_2_NAME] → II. Mandated Tech Stack & Parameterized Styling
  - [PRINCIPLE_3_NAME] → III. Plain Structure & Naming
  - [PRINCIPLE_4_NAME] → IV. Friendly Error Handling
  - [PRINCIPLE_5_NAME] → V. Spec-Driven, Zero Shadow Code
- Added sections: Data & Architecture Constraints; Versioning & Repository Workflow; Governance
- Removed sections: none
- Templates reviewed (not modified, read at runtime):
  - .specify/templates/plan-template.md ✅ Constitution Check gates derive from principles I–V
  - .specify/templates/spec-template.md ✅ no conflict
  - .specify/templates/tasks-template.md ✅ no conflict
- Deferred TODOs: none
-->

# GitHub User Search App Constitution

## Core Principles

### I. Design Fidelity (Figma Is the Source of Truth)

- The Figma file (`*.fig`) in `/figma-design` is the source of truth for CSS styles, spacing,
  fonts, colors, and the mobile, tablet, and desktop layouts.
- Styling details MUST be taken from the Figma pages "Design" and "Design System", read through
  the Figma Desktop MCP.
- Icons and images MUST come from the project assets first; they MAY be exported from the Figma
  file only when missing from the assets.
- Each layout MUST follow best responsive-design practices while still matching the Figma specs
  for that breakpoint.

**Rationale**: A primary goal of the project is to get the UI as close to the design as possible.

### II. Mandated Tech Stack & Parameterized Styling

- Frontend/UI MUST be built with React and TypeScript.
- Styling MUST use CSS Modules and classes.
- Fonts, colors, gradients, and typography MUST be parameterized as variables defined in a
  separate, dedicated file so they can be changed in one place.
- A backend, if one exists, MUST use Node.js + Express.js in TypeScript and follow REST API
  guidelines. A database, if one exists, MUST be Prisma Postgres accessed through the Prisma ORM.

**Rationale**: A fixed stack keeps the implementation predictable; centralized design tokens allow
later visual changes without touching components.

### III. Plain Structure & Naming

- The code structure MUST stay plain; overengineering (unneeded abstractions, layers, or
  indirection) is prohibited.
- React components MUST be function components.
- Functions and variables MUST use `camelCase`; interfaces, types, and classes MUST use
  `PascalCase`.

**Rationale**: A small challenge app is easiest to review and maintain when it is flat and
conventional.

### IV. Friendly Error Handling

- The UI MUST NEVER expose raw errors or stack traces to the end user.
- Every technical error MUST be translated into a friendly, human-readable message.
- A backend, if one exists, MUST always return semantically correct HTTP status codes.

**Rationale**: Users need understandable feedback; internal details are noise at best and a
leak at worst.

### V. Spec-Driven, Zero Shadow Code

- Only what is documented in the spec MAY be built. Features added "just in case" are prohibited.
- The spec is the source of truth for behavior. If a user instruction contradicts this
  constitution, or a logical flaw is detected, the AI agent MUST stop, explain the issue, and ask
  for the spec to be updated before touching any source code.

**Rationale**: The project exists to practice Spec-Driven Development with GitHub's Spec Kit;
undocumented code defeats that purpose.

## Data & Architecture Constraints

- Data MUST come only from the APIs defined in the spec (the GitHub users API).
- Backend and frontend, when both exist, MUST be separate apps in separate repositories: no
  monorepo, no monolith.

## Versioning & Repository Workflow

- A local git repository MUST be initialized if one does not already exist.
- GitHub repositories MUST be created with the prefix `fsdev-`.
- The GitHub repositories (frontend, and backend if applicable) MUST be created as the first step
  of the project.
- Figma design files MUST NEVER be pushed to GitHub; they MUST be excluded via `.gitignore`.

## Governance

- This constitution supersedes other practices and guidance for this project. The human-authored
  source is `my-sdd-docs/constitution.md`; this file is its Spec Kit restatement, and the two MUST
  be kept in sync.
- Amendments MUST be made by editing the constitution (via `/speckit-constitution`), with a Sync
  Impact Report describing the change.
- Versioning follows semantic versioning: MAJOR for removed or redefined principles, MINOR for new
  principles or materially expanded guidance, PATCH for clarifications and wording.
- Every plan (`/speckit-plan`) MUST pass the Constitution Check against principles I–V before and
  after design; any violation MUST be justified in the plan's Complexity Tracking section or
  removed.

**Version**: 1.0.0 | **Ratified**: 2026-09-23 | **Last Amended**: 2026-09-23
