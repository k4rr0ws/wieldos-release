# WieldOS v0.0.1

Orchestrate intelligence.

## Requirements

- [Docker](https://docs.docker.com/get-docker/) with the Compose plugin
- Port 3000 available (configurable via `PORT` in `.env`)

## Install

```bash
./wield install
```

Creates runtime directories, generates a starter `.env`, builds the Docker image, and starts the container. Edit `.env` before exposing to the internet.

## Commands

| Command | Description |
|---|---|
| `./wield start` | Start the container |
| `./wield stop` | Stop the container |
| `./wield restart` | Restart the container |
| `./wield logs` | Follow live logs |
| `./wield status` | Show container status |
| `./wield install` | First-time setup and start |
| `./wield update` | Check for updates and apply |
| `./wield backup` | Snapshot `data/` to `backups/` |
| `./wield verify` | Verify build integrity |

## Update

```bash
./wield update
```

Checks for a newer release, backs up `data/`, applies the update, and restarts. Your data, plugins, and `.env` are preserved.

## Data

All application state lives in `data/`. Back it up regularly — it contains your database, settings, and secrets.

```bash
./wield backup   # creates backups/backup-<timestamp>.tar.gz
```

## Verify

```bash
./wield verify
```

Recomputes the `dashboard/build/` hash and checks it against `manifests/release.json`. Run after install or update to confirm the build has not been modified.
