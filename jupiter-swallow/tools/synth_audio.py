"""Synthesize the music bed and all sound effects (nothing downloaded). Writes public/music.wav and public/sfx/*.wav."""
import wave, numpy as np
SR = 44100
rng = np.random.default_rng(7)

def write(path, x):
    x = np.asarray(x, np.float64)
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = x / max(1e-9, np.abs(x).max()) * 0.89  # peak about -1 dBFS; levels are set in Remotion
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())

def t_(d): return np.arange(int(d * SR)) / SR
def env(n, a, r):
    e = np.ones(n); ai, ri = min(n, int(a * SR)), min(n, int(r * SR))
    if ai: e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri) ** 2
    return e
def lp(x, a):  # one-pole low-pass, a in (0,1): smaller = darker
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x):
        s += a * (v - s); y[i] = s
    return y
def lp_fast(x, cutoff):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4); return np.fft.irfft(X, len(x))
def bp_fast(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (f / hi) ** 4)) * (1 / (1 + (lo / np.maximum(f, 1)) ** 4)); return np.fft.irfft(X, len(x))
def noise(d): return rng.standard_normal(int(d * SR))
def midi(m): return 440 * 2 ** ((m - 69) / 12)

# ---------------- music: slow ambient pad, D minor, 62 s ----------------
D = 75.0
t = t_(D); N = len(t)
L = np.zeros(N); R = np.zeros(N)
chords = [[50, 57, 62, 66], [47, 54, 59, 62], [43, 55, 59, 62], [45, 57, 61, 64]]  # D Bm G A (bright, wondering)
bar = 6.0
k = 0
start = 0.0
while start < D:
    ch = chords[k % 4]
    d = min(bar + 2.5, D - start)
    tt = t_(d); e = env(len(tt), 2.5, 3.0)
    i0 = int(start * SR)
    for j, m in enumerate(ch):
        f = midi(m)
        for det, pan in ((-0.12, 0.25), (0.12, 0.75)):
            v = (np.sin(2 * np.pi * (f + det) * tt) + 0.3 * np.sin(2 * np.pi * 2 * (f + det) * tt + 0.5)
                 + 0.12 * np.sin(2 * np.pi * 3 * (f + det) * tt)) * e * 0.08
            L[i0:i0 + len(tt)] += v * (1 - pan); R[i0:i0 + len(tt)] += v * pan
    start += bar; k += 1
# sub drone, swelling during the dive (24-42 s)
sw = np.interp(t, [0, 3, 19, 22, 30, 38, 44, 60, 75], [0, .4, .5, 1, 1, .7, .9, .5, 0])
sub = (np.sin(2 * np.pi * midi(38) * t) + 0.4 * np.sin(2 * np.pi * midi(50) * t)) * sw * 0.14
L += sub; R += sub
# sparkle arpeggio (soft plucks), every 0.625 s, quieter in the dive
notes = [74, 78, 81, 78, 76, 74, 69, 71]
for i, s in enumerate(np.arange(1.0, D - 2, 0.5)):
    if 20 < s < 30 or (i % 4 == 3):
        continue
    f = midi(notes[i % len(notes)]); tt = t_(1.4)
    v = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 4.5) * 0.05 * (0.7 if s > 50 else 1)
    i0 = int(s * SR); pan = 0.3 + 0.4 * ((i * 0.37) % 1)
    L[i0:i0 + len(tt)] += v * (1 - pan); R[i0:i0 + len(tt)] += v * pan
# simple stereo echo for space
dl = int(0.31 * SR)
L2 = L.copy(); R2 = R.copy(); L2[dl:] += 0.35 * R[:-dl]; R2[dl:] += 0.35 * L[:-dl]
mf = np.interp(t, [0, 2.5, D - 4, D], [0, 1, 1, 0])
write("public/music.wav", np.stack([L2 * mf, R2 * mf], 1))

# ---------------- sound effects ----------------
def whoosh(d=1.1, up=True):
    n = noise(d); tt = t_(d)
    sweep = np.linspace(300, 3500, len(tt)) if up else np.linspace(3500, 300, len(tt))
    out = np.zeros_like(n); s = 0.0
    a = 1 - np.exp(-2 * np.pi * sweep / SR)
    for i in range(len(n)):
        s += a[i] * (n[i] - s); out[i] = s
    e = np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
    return out * e
write("public/sfx/whoosh.wav", whoosh())
write("public/sfx/whoosh_down.wav", whoosh(1.4, False))

tt = t_(0.18); f = np.linspace(900, 500, len(tt))
write("public/sfx/pop.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 28))
tt = t_(0.05); write("public/sfx/tick.wav", np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 120))
tt = t_(2.5); write("public/sfx/rumble.wav", lp_fast(noise(2.5), 90) * env(len(tt), 0.4, 1.2))
tt = t_(1.2); f = np.linspace(90, 38, len(tt))
write("public/sfx/boom.wav", (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * lp_fast(noise(1.2), 200)) * np.exp(-tt * 3.2))
tt = t_(2.0)
saw = (2 * ((95 * tt + 3 * np.sin(2 * np.pi * 7 * tt)) % 1) - 1)
write("public/sfx/drill.wav", lp_fast(saw + 0.3 * noise(2.0), 1200) * (0.8 + 0.2 * np.sin(2 * np.pi * 11 * tt)) * env(len(tt), 0.15, 0.4))
tt = t_(1.8); cr = (rng.random(len(tt)) > 0.997) * rng.standard_normal(len(tt)) * 3
write("public/sfx/sizzle.wav", (bp_fast(noise(1.8), 3000, 9000) * 0.5 + bp_fast(cr, 1500, 8000)) * env(len(tt), 0.2, 0.8))
tt = t_(2.2)
write("public/sfx/chime.wav", sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) * g for f, k, g in
                                  [(1046.5, 2.0, 1), (1568, 2.6, .5), (2093, 3.2, .3), (2637, 4, .15)]))
tt = t_(2.4); f = 660 * np.exp(-tt * 0.15)
write("public/sfx/ping.wav", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 2.2) + 0.25 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * np.exp(-tt * 3))
tt = t_(6.0); w = bp_fast(noise(6.0), 250, 1400) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.35 * tt))
write("public/sfx/wind.wav", w * env(len(tt), 1.0, 2.0))
tt = t_(1.6); f = np.linspace(220, 70, len(tt))
write("public/sfx/creak.wav", lp_fast(np.sign(np.sin(2 * np.pi * np.cumsum(f + 8 * rng.standard_normal(len(tt))) / SR)), 900) * env(len(tt), 0.1, 0.6))
tt = t_(0.5); write("public/sfx/rise.wav", np.sin(2 * np.pi * np.cumsum(np.linspace(300, 900, len(tt))) / SR) * env(len(tt), 0.05, 0.25))
# ocean ambience (long, loopable-ish) and a rope snap
tt = t_(D); sw = bp_fast(noise(D), 120, 900) * (0.55 + 0.45 * np.sin(2 * np.pi * tt / 6.5) ** 2)
write("public/sfx/waves.wav", sw * env(len(tt), 2.0, 3.0))
tt = t_(0.35); write("public/sfx/snap.wav", (bp_fast(noise(0.35), 1500, 7000) + 0.6 * np.sin(2 * np.pi * 180 * tt)) * np.exp(-tt * 18))
tt = t_(1.4); write("public/sfx/bell.wav", sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * k) * g for f, k, g in [(523, 1.5, 1), (1046, 2.5, .4), (1308, 3.5, .25)]))
print("ok")
