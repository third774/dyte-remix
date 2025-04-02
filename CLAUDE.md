# CLAUDE.md - Guidelines for React-Router-Dyte Project

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
- Avoid using default exports where possible for simple functions, variables, and components. Sometimes it cannot be avoided though, like in route files for example.
- Don't import React when creating a new file with components in it.
- When creating new components that are styled wrappers around basic HTML elements:
  - Keep the prop interface the exact same
  - Use React's forwardRef
  - Forward all props onto the HTML element
  - Use the app/utils/cn.ts utility for composing className
- Avoid using placeholder text in inputs and textareas
- Avoid using barrel files
