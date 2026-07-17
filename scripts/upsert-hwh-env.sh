#!/usr/bin/env bash
# Upsert one secret into the parent HWH .env (outside the git repo).
# Never prints secret values — only KEY: upserted / KEY: present.
#
# Usage:
#   bash scripts/upsert-hwh-env.sh KEY          # value from stdin (trailing newline stripped)
#   bash scripts/upsert-hwh-env.sh KEY=value    # value as argument (prefer stdin for long tokens)
#   printf '%s' "$VALUE" | bash scripts/upsert-hwh-env.sh KEY
#
# Target: /Users/venkat/work/hwh/.env  (same as load-hwh-env.sh parent)
set -euo pipefail

if [[ -z "${BASH_VERSION:-}" ]]; then
  echo "ERROR: upsert-hwh-env.sh must run under bash." >&2
  exit 1
fi

PARENT_ENV="/Users/venkat/work/hwh/.env"
KEY=""
VALUE=""

usage() {
  sed -n '2,14p' "$0" | sed 's/^# \{0,1\}//'
}

if [[ $# -lt 1 ]]; then
  usage >&2
  exit 1
fi

case "$1" in
  -h|--help)
    usage
    exit 0
    ;;
  *=*)
    KEY="${1%%=*}"
    VALUE="${1#*=}"
    ;;
  *)
    KEY="$1"
    if [[ ! -t 0 ]]; then
      VALUE="$(cat)"
      # strip a single trailing newline commonly added by pipes/heredocs
      VALUE="${VALUE%$'\n'}"
    else
      echo "ERROR: pass value on stdin or as KEY=value" >&2
      exit 1
    fi
    ;;
esac

if [[ ! "$KEY" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
  echo "ERROR: invalid KEY name" >&2
  exit 1
fi

if [[ -z "$VALUE" ]]; then
  echo "ERROR: empty value for $KEY" >&2
  exit 1
fi

mkdir -p "$(dirname "$PARENT_ENV")"
touch "$PARENT_ENV"

python3 - "$PARENT_ENV" "$KEY" "$VALUE" <<'PY'
import json, sys
from pathlib import Path

path = Path(sys.argv[1])
key = sys.argv[2]
value = sys.argv[3]

text = path.read_text() if path.exists() else ""
lines = text.splitlines()
kept = []
for line in lines:
    if not line.strip() or line.lstrip().startswith("#"):
        kept.append(line)
        continue
    name = line.split("=", 1)[0].strip()
    if name == key:
        continue
    kept.append(line)

if not any(l.startswith("# HWH") for l in kept):
    kept.insert(0, "# HWH shared secrets (outside git) — never commit")

if any(c in value for c in ' \t#"\''):
    safe = json.dumps(value)
else:
    safe = value
kept.append(f"{key}={safe}")
path.write_text("\n".join(kept).rstrip() + "\n")
print(f"{key}: upserted")
PY
