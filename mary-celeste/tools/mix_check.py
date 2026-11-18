"""Voice-over-bed check: python3 tools/mix_check.py out/bed.wav [out/final.mp4]  (voice = public/voice.mp3 at +0.5 s)"""
import subprocess, sys, numpy as np
def load(p, off=0.0):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    return np.concatenate([np.zeros(int(off * 16000), np.float32), np.frombuffer(raw, np.int16).astype(np.float32) / 32768])
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
v, b = load("public/voice.mp3", 0.5), load(sys.argv[1]); n, w = min(len(v), len(b)), 8000
d = [rms(v[i:i + w]) - rms(b[i:i + w]) for i in range(0, n - w, w) if rms(v[i:i + w]) > -40]
print(f"voice over bed while speaking: median {np.median(d):.1f} dB, 10th pct {np.percentile(d, 10):.1f} dB, min {min(d):.1f} dB")
if len(sys.argv) > 2:
    m = load(sys.argv[2]); print(f"mix: RMS {rms(m):.1f} dBFS, peak {20 * np.log10(np.abs(m).max()):.1f} dBFS")
