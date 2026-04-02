#!/bin/bash
# Usage: ./scripts/seed.sh on | off

TARGET="src/app/_layout.tsx"
MARKER="__SEED__"

case "$1" in
  on)
    if grep -q "$MARKER" "$TARGET"; then
      echo "Seed already enabled"
      exit 0
    fi
    sed -i "1i\\import '@/scripts/seed'; // $MARKER" "$TARGET"
    echo "Seed enabled — restart the app to apply"
    ;;
  off)
    if ! grep -q "$MARKER" "$TARGET"; then
      echo "Seed not enabled"
      exit 0
    fi
    grep -v "$MARKER" "$TARGET" > "$TARGET.tmp" && mv "$TARGET.tmp" "$TARGET"
    echo "Seed disabled"
    ;;
  *)
    echo "Usage: ./scripts/seed.sh on|off"
    exit 1
    ;;
esac
