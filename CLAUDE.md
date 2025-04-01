# CLAUDE.md - Guidelines for Remix-Dyte Project

## Commands

- `pnpm run dev` - Start development server
- `pnpm run build` - Create production build
- `pnpm run deploy` - Build and deploy to production
- `pnpm run typecheck` - Run TypeScript type checking
- `pnpm run preview` - Preview production build locally

## Code Style

- **TypeScript**: Strict mode enabled with `noUncheckedIndexedAccess`
- **Imports**: Use path aliases (e.g., `~/utils/session.server` for `app/utils/session.server`)
- **Formatting**: No specific formatter configured (consider adding Prettier)
- **Components**: Follow React Router 7 conventions for loaders and actions
- **Naming**: Use camelCase for variables/functions, PascalCase for components/types
- **Error Handling**: Use proper HTTP responses with status codes

## Project Structure

- Cloudflare Workers for deployment
- React Router 7 for routing (SSR enabled)
- TailwindCSS for styling
- Dyte SDK for video meetings

## Best Practices

- Server code in `.server.ts` files
- Use React Router's Form component for form submissions
- Follow the pattern in existing files for new components
- Keep types strict and explicit
- Avoid casting `as any`
- Run `pnpm run typecheck` after making changes to make sure the types are correct.

