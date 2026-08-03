#!/bin/sh
# Regenerates the settings-picker thumbnails in
# src/lib/assets/backgrounds/thumbnails/ from the full-size backgrounds.
#
# The picker would otherwise decode 1920x1080 masters (~450 KB each) to paint
# 120px tiles, which is slow and holds ~8 MB of decoded bitmap per tile.
#
# Run after adding or replacing a background:  npm run thumbs
# Thumbnails are only rebuilt when older than their source, so re-runs are cheap.
#
# macOS only — sips ships with the OS, which keeps this off the dependency list.
# Backgrounds still work without a thumbnail: the picker falls back to the
# full-size image.

set -eu

WIDTH=480
QUALITY=65

root=$(cd "$(dirname "$0")/.." && pwd)
src="$root/src/lib/assets/backgrounds"
out="$src/thumbnails"

if ! command -v sips >/dev/null 2>&1; then
  echo "sips not found — this script needs macOS." >&2
  exit 1
fi

mkdir -p "$out"

made=0
kept=0
for image in "$src"/*.avif "$src"/*.png "$src"/*.jpg "$src"/*.jpeg "$src"/*.webp; do
  [ -e "$image" ] || continue

  name=$(basename "$image")
  thumb="$out/${name%.*}.avif"

  if [ -f "$thumb" ] && [ "$thumb" -nt "$image" ]; then
    kept=$((kept + 1))
    continue
  fi

  sips -Z "$WIDTH" \
    --setProperty format avif \
    --setProperty formatOptions "$QUALITY" \
    "$image" --out "$thumb" >/dev/null
  made=$((made + 1))
done

# Drop thumbnails whose background is gone, so deleting an image is enough.
stale=0
for thumb in "$out"/*.avif; do
  [ -e "$thumb" ] || continue

  name=$(basename "$thumb" .avif)
  if ! ls "$src/$name".* >/dev/null 2>&1; then
    rm "$thumb"
    stale=$((stale + 1))
  fi
done

echo "thumbnails: $made written, $kept up to date, $stale removed -> $out"
