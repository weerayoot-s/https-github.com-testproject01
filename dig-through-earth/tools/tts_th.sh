#!/usr/bin/env bash
# Thai voice-over: joins narration.txt lines with spaces and calls tools/tts.sh.
# Needs ELEVENLABS_VOICE_ID and ELEVENLABS_MODEL_ID (a model that speaks Thai, e.g. eleven_v3).
# The API key can come from the environment's network secret (the proxy adds it); then any dummy value works here.
set -euo pipefail
cd "$(dirname "$0")/.."
export ELEVENLABS_API_KEY="${ELEVENLABS_API_KEY:-dummy}"
tr '\n' ' ' < narration.txt | sed 's/ *$//' > out/narration_joined.txt
tools/tts.sh out/narration_joined.txt public/voice
python3 tools/make_timing.py public/voice.alignment.json --offset 0.5
