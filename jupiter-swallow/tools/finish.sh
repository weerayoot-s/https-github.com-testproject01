#!/usr/bin/env bash
# Usage: tools/finish.sh [Composition] [out.mp4]   (default JupiterSwallow out/final.mp4)
# Render, then two-pass loudness-normalise the soundtrack to -16 LUFS / -1.5 dBTP (video stream copied).
set -euo pipefail
cd "$(dirname "$0")/.."
COMP="${1:-JupiterSwallow}"; OUT="${2:-out/final.mp4}"; TMP="${OUT%.mp4}_norm.mp4"
npx remotion render "$COMP" "$OUT"
J=$(ffmpeg -hide_banner -i "$OUT" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
M=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i "$OUT" -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11:$M:linear=true" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$TMP"
mv "$TMP" "$OUT"
python3 -I tools/render_glitches.py "$OUT"
