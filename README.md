# Dyte React Router Example

## Setup

Run:

```sh
pnpm install
cp .dev.vars.example .dev.vars
```

Grab your Authorization Header [here](https://dev.dyte.io/apikeys). Paste it into .dev.vars `DYTE_AUTH_HEADER`.
You can set `SESSION_SECRET` to whatever value you'd like to use for signing your cookies, or just leave it unset.

## Deploy

`pnpm run deploy`

You can set the secrets for the deployment by running:

```sh
wrangler secret bulk .dev.vars
```
