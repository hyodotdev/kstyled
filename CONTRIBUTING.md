# Contributing to kstyled

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to kstyled.

## Development Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 8 (or bun >= 1.0)
- Git

### Getting Started

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/hyodotdev/kstyled.git
   cd kstyled
   ```

2. **Install dependencies**

   Using pnpm (recommended):

   ```bash
   pnpm install
   ```

   Using bun:

   ```bash
   bun install
   ```

3. **Build all packages**

   ```bash
   pnpm build
   # or
   bun run build
   ```

4. **Run the example app**

   ```bash
   pnpm dev
   # or
   bun run dev
   ```

## Project Structure

```sh
kstyled/
├── packages/
│   ├── kstyled/ # Runtime library (styled, ThemeProvider, etc.)
│   ├── babel-plugin-kstyled/ # Babel transformation plugin
│   ├── example/               # Expo example app for testing
│   └── docs/                  # Documentation (Docusaurus)
├── pnpm-workspace.yaml        # pnpm workspace configuration
├── turbo.json                 # Turborepo build pipeline
└── package.json               # Root package.json
```

## Development Workflow

### Making Changes

1. Create a new branch for your feature/fix:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes in the appropriate package:

   - Runtime changes: `packages/kstyled/src/`
   - Babel plugin changes: `packages/babel-plugin-kstyled/src/`
   - Example app changes: `packages/example/app/`
   - Documentation: `packages/docs/docs/`

3. Build and test your changes:

   ```bash
   pnpm build
   pnpm typecheck
   pnpm lint
   ```

4. Test in the example app:

   ```bash
   pnpm dev
   ```

### Running the Example App

#### Quick Start

The simplest way to start developing:

```bash
# Start Metro bundler
pnpm dev

# In a new terminal, run the platform you want:
pnpm --filter example android   # Android
pnpm --filter example ios        # iOS (Mac only)
pnpm --filter example web        # Web
```

#### Important: Metro Bundler

**One Metro instance serves all platforms** (Android, iOS, Web). Start Metro once, then connect each platform to it.

```txt
┌─────────────────────────────────┐
│   Metro Bundler (port 8081)     │
└─────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┐
    │         │        │        │
  Android    iOS     Web    ...
```

#### VSCode Development

Use the pre-configured launch tasks:

1. `Cmd+Shift+D` (Run and Debug panel)
2. Select **"Run Android"** or **"Run iOS"** - Metro starts automatically
3. After Metro is running, select **"Run Web"** to open browser (reuses Metro)

#### Port Conflicts

If you get "Port 8081 already in use":

```bash
# Check what's using the port
lsof -i:8081

# Kill the process
lsof -ti:8081 | xargs kill -9

# Restart Metro
pnpm dev
```

### Code Style

- Use TypeScript for all source code
- Follow existing code style (use ESLint)
- Add JSDoc comments for public APIs
- Write descriptive commit messages

### Type Checking

All packages use TypeScript. Run type checking with:

```bash
pnpm typecheck
```

### Linting

We use ESLint for code quality. Run linting with:

```bash
pnpm lint
```

## Testing

### Manual Testing

The example app (`packages/example/`) is the primary way to test changes:

1. Make changes to kstyled or babel-plugin-kstyled
2. Rebuild: `pnpm build`
3. Run example: `pnpm dev`
4. Test your changes in the Expo app

### Adding Test Cases

When adding new features, please add examples to the demo app:

- Add new screens to `packages/example/app/`
- Demonstrate the feature with clear UI
- Add comments explaining the feature

## Pull Request Process

1. **Update documentation** - Update README.md if you're adding new features
2. **Test thoroughly** - Ensure your changes work in the example app
3. **Write clear PR description** - Explain what and why
4. **Link related issues** - Reference any related issue numbers

### PR Title Format

Use conventional commit format:

- `feat: add variants API`
- `fix: resolve theme context issue`
- `docs: update installation guide`
- `perf: optimize style merging`
- `refactor: simplify CSS parser`
- `test: add benchmark tests`

## Package Scripts

### Root Level

- `pnpm build` - Build all packages
- `pnpm dev` - Run example app
- `pnpm typecheck` - Type check all packages
- `pnpm lint` - Lint all packages
- `pnpm clean` - Clean all build artifacts

### Package Level

Each package has its own scripts:

```bash
cd packages/kstyled
pnpm build       # Build this package
pnpm typecheck   # Type check
pnpm lint        # Lint
pnpm test        # Run tests (if available)
```

## Turborepo

This project uses Turborepo for build orchestration. Key concepts:

- **Task dependencies** - `build` tasks depend on dependencies being built first
- **Caching** - Build outputs are cached for speed
- **Parallel execution** - Independent tasks run in parallel

## Bun and pnpm Support

Both package managers are fully supported:

### pnpm (Primary)

```bash
pnpm install
pnpm build
pnpm dev
```

### Bun (Alternative)

```bash
bun install
bun run build
bun run dev
```

**Note:** The lockfiles for both are committed:

- `pnpm-lock.yaml` for pnpm
- `bun.lockb` for bun

## Release Process

(For maintainers)

```bash
# 1. Build and test
pnpm build && pnpm typecheck && pnpm test

# 2. Login to npm
npm login

# 3. Publish (dry-run first)
pnpm publish:dry
pnpm publish:packages

# 4. Create git tag
git tag v0.1.0
git push origin v0.1.0
```

**Version updates**: Manually edit version in `packages/kstyled/package.json` and `packages/babel-plugin-kstyled/package.json`

## Troubleshooting

### Metro WebSocket Connection Errors

If you see "WebSocket exception" or "Cannot connect to Metro":

**Common cause**: Port forwarding not set up (Android)

```bash
# Set up port forwarding
adb reverse tcp:8081 tcp:8081

# Verify Metro is running
curl http://localhost:8081/status
# Should return: {"packager":"running"}
```

**If Metro crashed**: Restart with cache clear

```bash
pnpm --filter example start -- --reset-cache
```

### Build Issues

**"Unable to resolve module" errors**:

```bash
# Clean and rebuild
pnpm clean
pnpm install
pnpm build

# Clear Metro cache
cd packages/example
rm -rf .expo node_modules/.cache
pnpm start --clear
```

**Babel transformation not working**:

```bash
# Rebuild babel plugin
cd packages/babel-plugin-kstyled
pnpm build

# Clear example cache
cd ../example
rm -rf .expo
pnpm start --clear
```

### Testing Your Changes

After making changes to `kstyled` or `babel-plugin-kstyled`:

1. **Rebuild the package**:

   ```bash
   pnpm build
   ```

2. **Clear example cache**:

   ```bash
   cd packages/example
   rm -rf .expo
   ```

3. **Restart Metro with clean cache**:

   ```bash
   pnpm start --clear
   ```

4. **Reload the app**: Press `r` in Metro terminal or reload in simulator

### VSCode Debug Configurations

Useful launch configurations in `.vscode/launch.json`:

- **Fix Metro WebSocket Issues** - Auto-fixes port forwarding and Metro connection
- **Start Metro (Reset Cache)** - Starts Metro with clean cache
- **View Android Logs** - Real-time Android logcat filtering

## Questions?

If you have questions, please:

1. Check the [README](README.md)
2. Check the [Documentation](https://hyodotdev.github.io/kstyled) (includes Troubleshooting guide)
3. Open a [Discussion](https://github.com/hyodotdev/kstyled/discussions)
4. File an [Issue](https://github.com/hyodotdev/kstyled/issues)

Thank you for contributing! 🎉
