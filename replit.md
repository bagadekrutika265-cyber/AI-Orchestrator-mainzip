# AI ORCHESTRATOR

## Run commands

- Install dependencies: `npm run install:all`
- Start development: `npm run dev`
- Backend API: port 5000
- Frontend preview: port 3000
- Build: `npm run build`

The app keeps the existing React/Vite + Express/TypeScript structure. The public landing page
is at `/`; application views require a session from `/login`. Demo accounts and password details
are documented in `README.md`.

## Integration notes

- The workflow engine remains language-neutral. Request language detection and presentation
  localization are handled at the interaction layer.
- Authentication uses in-memory demo sessions and scrypt password hashes. Replace the in-memory
  user/session store with the project's persistent auth provider before production use.
- Do not add secrets to source files. Gemini and other provider credentials belong in Replit
  Secrets.