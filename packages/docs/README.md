# K-Dev Demon Styles Documentation

This directory contains the documentation website for kstyled.

## Development

```bash
pnpm start
```

Opens the documentation site at http://localhost:3000

## Build

```bash
pnpm build
```

Builds static files to the `build` directory.

## Deploy

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## Structure

- `docs/` - Documentation content (markdown files)
- `src/` - Custom React components
- `static/` - Static assets (images, favicons)
- `docusaurus.config.ts` - Docusaurus configuration
- `sidebars.ts` - Sidebar navigation structure
