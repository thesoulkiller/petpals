# PetPals

A social matching app for people who want to meet through their pets. Swipe, match, and connect with people to date, make friends, walk dogs together, or find playmates for your pets.

Built with Expo SDK 54, Tamagui 2.0, and Expo Router.

## Design System

Direction C — Bold Gradient. See [`DESIGN.md`](./DESIGN.md) for the full spec.

- Display: Clash Grotesk Bold
- Body: DM Sans
- Gradient: `#FF6B9D → #FF8C61` (pink to coral)
- Cards: glass morphism, `rgba(255,255,255,0.20)` + backdrop blur

## Running the app

```sh
cd apps/expo
yarn start
# Press 'i' to open iOS Simulator
# Press 'a' to open Android Emulator
```

## Folder layout

```
apps/
  expo/
    app/         # Expo Router file-based routes
    features/    # Feature screens (discover, match, profile, likes, paywall)
    context/     # React context (auth, etc.)
    config/      # Tamagui config (inline from packages/config)
    ui/          # Shared UI components (inline from packages/ui)
    assets/      # Images, fonts
```

## Stack

- [Expo SDK 54](https://expo.dev) — React Native with Expo Go support
- [Expo Router v6](https://expo.github.io/router) — file-based navigation
- [Tamagui 2.0](https://tamagui.dev) — universal UI components
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context) — safe area handling
- [zeego](https://zeego.dev) — native menus

## AI-assisted development

This project uses Claude Code with gstack. Before making any visual changes, read `DESIGN.md`. Before adding new screens, read `CLAUDE.md`.
