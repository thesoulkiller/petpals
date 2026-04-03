# Changelog

All notable changes to PetPals will be documented here.

## [0.1.0.1] - 2026-04-03

### Added
- `DESIGN.md` — Bold Gradient design system. Clash Grotesk display, DM Sans body, pink-to-coral gradient (`#FF6B9D → #FF8C61`), glass morphism cards, white pill CTA on gradient.
- `CLAUDE.md` — Project-level instructions pointing all visual and UI decisions to DESIGN.md. Ensures Claude reads the design system before making any style choices.

### Changed
- Expo dev server launch script: switched from fixed port 8082 to default port 8081 with cache-clear (`-c`) flag for faster restarts.
- `.gitignore`: added `.gstack/` to keep local AI session data out of source control.
