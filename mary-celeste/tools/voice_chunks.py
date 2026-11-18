"""Split public/voice.mp3 at its pauses and write src/chunks.json (speech chunks in video time).
Usage: python3 tools/voice_chunks.py [--offset 0.5]"""
import argparse, json, re, subprocess
ap = argparse.ArgumentParser(); ap.add_argument("--offset", type=float, default=0.5); a = ap.parse_args()
err = subprocess.run(["ffmpeg", "-hide_banner", "-i", "public/voice.mp3", "-af", "silencedetect=noise=-38dB:d=0.2", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
h, m, s = re.findall(r"Duration: (\d+):(\d+):([\d.]+)", err)[0]; dur = int(h) * 3600 + int(m) * 60 + float(s)
ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]; se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
if len(se) < len(ss): se.append(dur)
starts, ends, t = [], [], 0.0
for a0, b0 in zip(ss, se):
    if a0 - t > 0.05: starts.append(t); ends.append(a0)
    t = b0
if dur - t > 0.05: starts.append(t); ends.append(dur)
ch = [{"s": round(x + a.offset, 3), "e": round(y + a.offset, 3)} for x, y in zip(starts, ends)]
json.dump({"offset": a.offset, "voiceDur": dur, "chunks": ch}, open("src/chunks.json", "w"), indent=1)
for i, c in enumerate(ch): print(i, c["s"], c["e"])
