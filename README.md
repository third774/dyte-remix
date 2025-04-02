# Dyte Remix Example

## Setup

Run:

```sh
pnpm install
cp .dev.vars.example .dev.vars
```

Grab your Authorization Header [here](https://dev.dyte.io/apikeys). Paste it into .dev.vars `DYTE_AUTH_HEADER`.

To set the secret for the deployed instance, run `wrangler secret put DYTE_AUTH_HEADER` and paste it in.

## Deploy

`pnpm run deploy`
