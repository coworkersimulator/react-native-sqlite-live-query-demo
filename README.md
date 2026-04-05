# SQLite as State: A React Native Demo

[YouTube Demo]()

This React Native application demonstrates using SQLite with live queries to reduce React state. Rather than managing complex client-side state, the app uses the database as the single source of truth — queries re-run reactively whenever data changes.

## What it does

- Displays a scrollable list of fruit emojis
- Records each tap as a click in a local SQLite database
- Shows per-fruit click counts, updated live
- Plays a confetti animation on tap
- Supports clearing all click history

## Tech Stack

- [Expo](https://expo.dev) / React Native
- [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) — local SQLite database
- [Drizzle ORM](https://orm.drizzle.team) — schema management and typed queries
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) — animations

## Getting Started

```bash
npm install
npm start
```

Then scan the QR code with [Expo Go](https://expo.dev/go), or run directly on a simulator:

```bash
npm run ios
npm run android
```

## Project Structure

```
App.tsx                        # Root component, SQLiteProvider setup
drizzle/schema.ts              # Table definitions (fruit, click)
assets/db/migrations-client/   # SQL migrations loaded at startup
utils/create-tmp-db.ts         # Helper for Drizzle schema generation
drizzle.config.ts              # Drizzle Kit configuration
```

## How it works

On startup, SQL migrations are loaded as bundled assets and run against the local SQLite database. The `fruit` table is seeded with emoji data. Each tap inserts a row into the `click` table. Live queries (via `expo-sqlite`) watch for changes and re-render the UI automatically — no manual state sync needed.
