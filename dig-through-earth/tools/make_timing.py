"""Build src/timing.json: one entry per narration line (segment), each split into phrases at spaces.

Usage:
  python3 tools/make_timing.py estimate            # no voice yet: times estimated from Thai character counts
  python3 tools/make_timing.py public/voice.alignment.json   # real ElevenLabs character alignment
Options: --offset 0.5 (voice start in the video), --speech 53 (estimate: total seconds of speech)
The text sent to ElevenLabs must be narration.txt joined with single spaces (tools/tts_th.sh does that).
"""
import argparse, json, unicodedata

ap = argparse.ArgumentParser()
ap.add_argument("source")
ap.add_argument("--offset", type=float, default=0.5)
ap.add_argument("--speech", type=float, default=53.0)
ap.add_argument("--pause", type=float, default=0.45)
a = ap.parse_args()

lines = [l.strip() for l in open("narration.txt", encoding="utf-8") if l.strip()]
text = " ".join(lines)

def weight(ch):
    if ch.isspace():
        return 0.6
    return 0.0 if unicodedata.category(ch) == "Mn" else 1.0

if a.source == "estimate":
    # per-character start/end times: speaking weight spread over a.speech seconds, plus pauses between lines
    total_w = sum(weight(c) for c in text)
    rate = (a.speech - a.pause * (len(lines) - 1)) / total_w
    st, en, t = [], [], 0.0
    li_end = set()
    pos = 0
    for l in lines[:-1]:
        pos += len(l)
        li_end.add(pos)  # index of the joining space after this line
        pos += 1
    for i, c in enumerate(text):
        d = a.pause if i in li_end else weight(c) * rate
        st.append(t); t += d; en.append(t)
    src = "estimate"
else:
    al = json.load(open(a.source))
    al = al.get("alignment", al)
    assert "".join(al["characters"]) == text, "alignment text differs from narration.txt"
    st, en = al["character_start_times_seconds"], al["character_end_times_seconds"]
    src = "elevenlabs"

segs, pos = [], 0
for l in lines:
    phrases, p = [], pos
    for ph in l.split(" "):
        if ph:
            phrases.append({"text": ph, "s": round(st[p] + a.offset, 3), "e": round(en[p + len(ph) - 1] + a.offset, 3)})
        p += len(ph) + 1
    segs.append({"text": l, "s": phrases[0]["s"], "e": phrases[-1]["e"], "phrases": phrases})
    pos += len(l) + 1
out = {"source": src, "offset": a.offset, "voiceEnd": segs[-1]["e"], "segments": segs}
json.dump(out, open("src/timing.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for i, s in enumerate(segs):
    print(f"{i:2d} {s['s']:6.2f}-{s['e']:6.2f}  {s['text'][:40]}")
print("source:", src, " voice ends at", segs[-1]["e"])
