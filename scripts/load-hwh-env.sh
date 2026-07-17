#!/usr/bin/env bash
# Unified HWH credential loader — parent .env first, repo .env overrides.
# Usage: source scripts/load-hwh-env.sh  (must be bash, not zsh)
set -euo pipefail

if [[ -z "${BASH_VERSION:-}" ]]; then
  echo "ERROR: load-hwh-env.sh must be sourced from bash." >&2
  echo "Use: bash -c 'source scripts/load-hwh-env.sh && hwh_env_check VAR'" >&2
  return 1 2>/dev/null || exit 1
fi

HWH_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HWH_PARENT_ENV="/Users/venkat/work/hwh/.env"
HWH_REPO_ENV="${HWH_REPO_ROOT}/.env"

_hwh_source_env() {
  local file="$1"
  if [[ -f "$file" ]]; then
    set -a
    # shellcheck disable=SC1090
    source "$file"
    set +a
  fi
}

_hwh_source_env "$HWH_PARENT_ENV"
_hwh_source_env "$HWH_REPO_ENV"

# Fallback: Vercel CLI auth.json (project-local, then global macOS default).
if [[ -z "${VERCEL_ACCESS_TOKEN:-}" ]]; then
  for _HWH_VERCEL_AUTH in \
    "${HWH_REPO_ROOT}/.vercel-cli-config/com.vercel.cli/auth.json" \
    "${HOME}/Library/Application Support/com.vercel.cli/auth.json"; do
    if [[ -f "$_HWH_VERCEL_AUTH" ]]; then
      VERCEL_ACCESS_TOKEN="$(python3 -c "import json,sys; print(json.load(open(sys.argv[1])).get('token',''))" "$_HWH_VERCEL_AUTH" 2>/dev/null || true)"
      if [[ -n "$VERCEL_ACCESS_TOKEN" ]]; then
        export VERCEL_ACCESS_TOKEN
        break
      fi
    fi
  done
  unset _HWH_VERCEL_AUTH
fi

export HWH_REPO_ROOT HWH_PARENT_ENV HWH_REPO_ENV

# Check required vars without printing values.
# Usage: hwh_env_check VAR1 VAR2 ...
# Exit 1 if any missing.
hwh_env_check() {
  local missing=0
  for var in "$@"; do
    if [[ -n "${!var:-}" ]]; then
      echo "${var}: present"
    else
      echo "${var}: missing"
      missing=1
    fi
  done
  if [[ "$missing" -eq 1 ]]; then
    echo "Credential files checked:" >&2
    echo "  parent: ${HWH_PARENT_ENV} ($([[ -f $HWH_PARENT_ENV ]] && echo exists || echo not found))" >&2
    echo "  repo:   ${HWH_REPO_ENV} ($([[ -f $HWH_REPO_ENV ]] && echo exists || echo not found))" >&2
    return 1
  fi
  return 0
}
