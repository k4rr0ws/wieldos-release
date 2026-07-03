# WieldOS — Release

Prebuilt, deployable WieldOS Dashboard. Generated from the source repo by
`scripts/package-release.js`; do not edit these files by hand — change the source
and re-run `npm run build`.

## Run with Docker (recommended)

```bash
cp .env.example .env      # optionally set ANTHROPIC_API_KEY before first boot
docker compose up -d
docker compose logs -f
```

## Run on bare metal (Node.js 24)

```bash
cp .env.example .env
./start.sh                # installs prod deps on first run, then starts
```

The server listens on `http://0.0.0.0:3000`. Put Caddy or Nginx in front for HTTPS.

## Configuration

Almost everything is configured in the app (Settings + Instances) and stored in
the SQLite database under `data/`. `.env` only holds bootstrap values and an
optional one-time first-boot seed — see `.env.example`.

## Data & backups

`data/` holds the SQLite database (settings, secrets, agent state) and uploaded
avatars. Back it up regularly and treat those backups as sensitive.

## Schema migrations

Migrations run automatically at startup — there is nothing to run by hand.
