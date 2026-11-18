#!/usr/bin/env bash
# Render, then two-pass loudness-normalise the soundtrack to -16 LUFS / -1.5 dBTP (video stream copied).
set -euo pipefail
cd "$(dirname "$0")/.."
npx remotion render MaryCeleste out/final.mp4
J=$(ffmpeg -hide_banner -i out/final.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
M=$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(f\"measured_I={d['input_i']}:measured_TP={d['input_tp']}:measured_LRA={d['input_lra']}:measured_thresh={d['input_thresh']}:offset={d['target_offset']}\")")
ffmpeg -v error -y -i out/final.mp4 -c:v copy -af "loudnorm=I=-16:TP=-1.5:LRA=11:$M:linear=true" -ar 48000 -c:a aac -b:a 192k -movflags +faststart out/final_norm.mp4
mv out/final_norm.mp4 out/final.mp4
python3 -I tools/render_glitches.py out/final.mp4
