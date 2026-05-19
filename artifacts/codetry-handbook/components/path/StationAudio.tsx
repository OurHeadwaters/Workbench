// Station narration player. Web uses HTML <audio>; native shows a
// placeholder until expo-audio is added.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { usePioneerPath } from "@/lib/pioneerPath/store";

const SERIF_ITALIC = "Fraunces_400Regular_Italic";
const MONO = "JetBrainsMono_500Medium";

type ImportMetaWithEnv = ImportMeta & { env?: { BASE_URL?: string } };

function audioUrlForSlug(slug: string): string {
  if (Platform.OS !== "web") return "";
  const meta = import.meta as ImportMetaWithEnv;
  const base = meta.env?.BASE_URL ?? "/";
  const trimmed = base.endsWith("/") ? base : base + "/";
  return `${trimmed}narration/${slug}.mp3`;
}

function fmt(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Playback speeds the speed-pill cycles through.
const SPEEDS = [1, 1.25, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

// Sleep timer durations (minutes). 0 = off.
const SLEEPS = [0, 15, 30, 45] as const;
type SleepMin = (typeof SLEEPS)[number];

export function StationAudio({
  stationId,
  stationName,
  slug,
}: {
  stationId: string;
  stationName: string;
  slug: string;
}) {
  const c = useColors();
  const { ready: storeReady, saveAudioPosition, getAudioPosition } = usePioneerPath();

  if (Platform.OS !== "web") {
    return <PlaceholderCard />;
  }

  return (
    <WebAudioPlayer
      key={stationId}
      stationId={stationId}
      stationName={stationName}
      slug={slug}
      colors={c}
      storeReady={storeReady}
      saveAudioPosition={saveAudioPosition}
      getAudioPosition={getAudioPosition}
    />
  );
}

function PlaceholderCard() {
  const c = useColors();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: c.card, borderColor: c.rule },
      ]}
    >
      <Text
        style={[
          styles.eyebrow,
          { color: c.mutedForeground, fontFamily: MONO },
        ]}
      >
        LISTEN
      </Text>
      <Text
        style={[styles.placeholder, { color: c.foreground, fontFamily: SERIF_ITALIC }]}
      >
        The narration is recorded for the open web. Open this station in a browser to hear it, or read on.
      </Text>
    </View>
  );
}

function WebAudioPlayer({
  stationId,
  stationName,
  slug,
  colors,
  storeReady,
  saveAudioPosition,
  getAudioPosition,
}: {
  stationId: string;
  stationName: string;
  slug: string;
  colors: ReturnType<typeof useColors>;
  storeReady: boolean;
  saveAudioPosition: (id: string, s: number) => void;
  getAudioPosition: (id: string) => number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);
  const [sleepMin, setSleepMin] = useState<SleepMin>(0);
  const [sleepDeadline, setSleepDeadline] = useState<number | null>(null);

  const url = audioUrlForSlug(slug);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = new window.Audio();
    el.preload = "metadata";
    el.src = url;

    const onLoaded = () => {
      setDuration(el.duration || 0);
      setAvailable(true);
      setReady(true);
      const saved = getAudioPosition(stationId);
      if (saved > 0 && el.duration && saved < el.duration - 1) {
        try {
          el.currentTime = saved;
          setPosition(saved);
        } catch {}
      }
    };
    const onTime = () => {
      if (!draggingRef.current) {
        setPosition(el.currentTime || 0);
      }
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      saveAudioPosition(stationId, 0);
    };
    const onError = () => {
      setAvailable(false);
      setReady(true);
    };

    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);

    audioRef.current = el;

    return () => {
      try {
        el.pause();
      } catch {}
      try {
        if (
          el.currentTime > 0 &&
          el.duration &&
          el.currentTime < el.duration - 1
        ) {
          saveAudioPosition(stationId, el.currentTime);
        }
      } catch {}
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
      el.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId, url]);

  // Resume race: store hydration is async. If `getAudioPosition` was
  // called before the store was ready, the seek above no-ops. Once
  // both the audio metadata and the store are ready, re-check the
  // saved position and apply it (only while still at the start of
  // the track, so we never clobber an active listening session).
  const resumedKeyRef = useRef<string | null>(null);
  useEffect(() => {
    if (!storeReady || !ready) return;
    if (resumedKeyRef.current === stationId) return;
    resumedKeyRef.current = stationId;
    const el = audioRef.current;
    if (!el) return;
    if (el.currentTime > 1) return;
    const saved = getAudioPosition(stationId);
    if (saved > 0 && el.duration && saved < el.duration - 1) {
      try {
        el.currentTime = saved;
        setPosition(saved);
      } catch {}
    }
  }, [storeReady, ready, stationId, getAudioPosition]);

  useEffect(() => {
    if (!playing) return;
    const t = window.setInterval(() => {
      const el = audioRef.current;
      if (el && el.currentTime > 0) {
        saveAudioPosition(stationId, el.currentTime);
      }
    }, 5000);
    return () => window.clearInterval(t);
  }, [playing, stationId, saveAudioPosition]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = speed;
  }, [speed, ready]);

  const cycleSpeed = useCallback(() => {
    setSpeed((cur) => {
      const idx = SPEEDS.indexOf(cur);
      return SPEEDS[(idx + 1) % SPEEDS.length];
    });
  }, []);

  useEffect(() => {
    if (sleepMin === 0) {
      setSleepDeadline(null);
      return;
    }
    setSleepDeadline(Date.now() + sleepMin * 60_000);
  }, [sleepMin]);

  useEffect(() => {
    if (sleepDeadline == null) return;
    const tick = () => {
      if (Date.now() >= sleepDeadline) {
        const el = audioRef.current;
        if (el && !el.paused) {
          try {
            el.pause();
          } catch {}
        }
        setSleepMin(0);
      }
    };
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [sleepDeadline]);

  const cycleSleep = useCallback(() => {
    setSleepMin((cur) => {
      const idx = SLEEPS.indexOf(cur);
      return SLEEPS[(idx + 1) % SLEEPS.length];
    });
  }, []);

  const toggle = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {
        setAvailable(false);
      });
    } else {
      el.pause();
    }
  }, []);

  const seekTo = useCallback((seconds: number) => {
    const el = audioRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min((el.duration || 0) - 0.1, seconds));
    try {
      el.currentTime = next;
      setPosition(next);
      saveAudioPosition(stationId, next);
    } catch {}
  }, [saveAudioPosition, stationId]);

  const skip = useCallback(
    (delta: number) => {
      const el = audioRef.current;
      if (!el) return;
      seekTo((el.currentTime || 0) + delta);
    },
    [seekTo],
  );

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ms = navigator.mediaSession;
    if (!ms) return;
    if (!ready || available === false) return;

    ms.metadata = new window.MediaMetadata({
      title: stationName,
      artist: "Headwaters · The Pioneer Path",
      album: "Headwaters",
    });

    const handlers: Array<[MediaSessionAction, MediaSessionActionHandler]> = [
      ["play", () => toggle()],
      ["pause", () => toggle()],
      ["seekbackward", (e) => skip(-(e.seekOffset ?? 15))],
      ["seekforward", (e) => skip(e.seekOffset ?? 15)],
      [
        "seekto",
        (e) => {
          if (typeof e.seekTime === "number") seekTo(e.seekTime);
        },
      ],
    ];
    for (const [action, handler] of handlers) {
      try {
        ms.setActionHandler(action, handler);
      } catch {}
    }

    return () => {
      for (const [action] of handlers) {
        try {
          ms.setActionHandler(action, null);
        } catch {}
      }
    };
  }, [ready, available, stationName, toggle, skip, seekTo]);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const ms = navigator.mediaSession;
    if (!ms || typeof ms.setPositionState !== "function") return;
    if (!duration) return;
    try {
      ms.setPositionState({
        duration,
        playbackRate: speed,
        position: Math.min(position, duration),
      });
    } catch {}
    ms.playbackState = playing ? "playing" : "paused";
  }, [position, duration, speed, playing]);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || !duration) return;
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      seekTo(ratio * duration);
    },
    [duration, seekTo],
  );

  const onTrackPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      draggingRef.current = true;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      seekFromClientX(e.clientX);
    },
    [seekFromClientX],
  );

  const onTrackPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;
      seekFromClientX(e.clientX);
    },
    [seekFromClientX],
  );

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  }, []);

  if (!ready) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.rule }]}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground, fontFamily: MONO }]}>
          LISTEN
        </Text>
        <Text style={[styles.loading, { color: colors.mutedForeground, fontFamily: SERIF_ITALIC }]}>
          Loading narration…
        </Text>
      </View>
    );
  }

  if (available === false) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.rule }]}>
        <Text style={[styles.eyebrow, { color: colors.mutedForeground, fontFamily: MONO }]}>
          LISTEN
        </Text>
        <Text style={[styles.placeholder, { color: colors.foreground, fontFamily: SERIF_ITALIC }]}>
          The narration for this station hasn't been recorded yet. Read on — the words are below.
        </Text>
      </View>
    );
  }

  const progress = duration > 0 ? Math.min(1, position / duration) : 0;
  const sleepRemaining =
    sleepDeadline != null
      ? Math.max(0, Math.ceil((sleepDeadline - Date.now()) / 60_000))
      : 0;

  return (
    <View
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.rule }]}
    >
      <Text
        style={[styles.eyebrow, { color: colors.mutedForeground, fontFamily: MONO }]}
      >
        LISTEN
      </Text>
      <View style={styles.controls}>
        <Pressable
          onPress={() => skip(-15)}
          accessibilityLabel="Back fifteen seconds"
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="play-back" size={22} color={colors.foreground} />
          <Text style={[styles.iconLabel, { color: colors.mutedForeground, fontFamily: MONO }]}>15</Text>
        </Pressable>
        <Pressable
          onPress={toggle}
          accessibilityLabel={playing ? "Pause narration" : "Play narration"}
          style={({ pressed }) => [
            styles.playBtn,
            {
              backgroundColor: colors.foreground,
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons
            name={playing ? "pause" : "play"}
            size={28}
            color={colors.background}
          />
        </Pressable>
        <Pressable
          onPress={() => skip(15)}
          accessibilityLabel="Forward fifteen seconds"
          style={({ pressed }) => [styles.iconBtn, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Ionicons name="play-forward" size={22} color={colors.foreground} />
          <Text style={[styles.iconLabel, { color: colors.mutedForeground, fontFamily: MONO }]}>15</Text>
        </Pressable>
      </View>

      {/*
        The interactive track. We attach pointer handlers directly to a
        plain <div> so we get a single, captured drag stream from
        pointerdown through pointermove/pointerup, even when the user's
        finger leaves the visible track. Hit area is enlarged with
        vertical padding so it's easy to grab on touch screens.
      */}
      <div
        ref={trackRef}
        role="slider"
        aria-label="Scrub narration"
        aria-valuemin={0}
        aria-valuemax={Math.max(1, Math.floor(duration))}
        aria-valuenow={Math.floor(position)}
        tabIndex={0}
        onPointerDown={onTrackPointerDown}
        onPointerMove={onTrackPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") skip(-5);
          else if (e.key === "ArrowRight") skip(5);
          else if (e.key === "Home") seekTo(0);
          else if (e.key === "End" && duration) seekTo(duration - 0.1);
        }}
        style={{
          paddingTop: 14,
          paddingBottom: 14,
          marginTop: -10,
          marginBottom: -10,
          cursor: "pointer",
          touchAction: "none",
        }}
      >
        <View style={[styles.progressTrack, { backgroundColor: colors.rule }]}>
          <View
            style={[
              styles.progressFill,
              { backgroundColor: colors.foreground, width: `${progress * 100}%` },
            ]}
          />
          <View
            style={[
              styles.scrubHandle,
              {
                backgroundColor: colors.foreground,
                left: `${progress * 100}%`,
              },
            ]}
            pointerEvents="none"
          />
        </View>
      </div>

      <View style={styles.timeRow}>
        <Text style={[styles.time, { color: colors.mutedForeground, fontFamily: MONO }]}>
          {fmt(position)}
        </Text>
        <Text style={[styles.time, { color: colors.mutedForeground, fontFamily: MONO }]}>
          {fmt(duration)}
        </Text>
      </View>

      <View style={styles.chipRow}>
        <Pressable
          onPress={cycleSpeed}
          accessibilityLabel={`Playback speed ${speed} times. Tap to change.`}
          style={({ pressed }) => [
            styles.chip,
            { borderColor: colors.rule, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.chipLabel, { color: colors.mutedForeground, fontFamily: MONO }]}>
            SPEED
          </Text>
          <Text style={[styles.chipValue, { color: colors.foreground, fontFamily: MONO }]}>
            {speed.toFixed(2).replace(/0$/, "")}×
          </Text>
        </Pressable>
        <Pressable
          onPress={cycleSleep}
          accessibilityLabel={
            sleepMin === 0
              ? "Sleep timer off. Tap to set."
              : `Sleep timer ${sleepRemaining} minutes remaining. Tap to change.`
          }
          style={({ pressed }) => [
            styles.chip,
            { borderColor: colors.rule, opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={[styles.chipLabel, { color: colors.mutedForeground, fontFamily: MONO }]}>
            SLEEP
          </Text>
          <Text style={[styles.chipValue, { color: colors.foreground, fontFamily: MONO }]}>
            {sleepMin === 0 ? "OFF" : `${sleepRemaining}m`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 15,
    lineHeight: 22,
  },
  loading: {
    fontSize: 14,
    lineHeight: 20,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    marginBottom: 14,
  },
  iconBtn: {
    alignItems: "center",
    width: 44,
  },
  iconLabel: {
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 2,
  },
  playBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  progressTrack: {
    height: 3,
    borderRadius: 2,
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  scrubHandle: {
    position: "absolute",
    top: -5,
    width: 13,
    height: 13,
    marginLeft: -7,
    borderRadius: 7,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  time: {
    fontSize: 11,
    letterSpacing: 0.6,
  },
  chipRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
    justifyContent: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 999,
  },
  chipLabel: {
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  chipValue: {
    fontSize: 12,
    letterSpacing: 0.4,
  },
});
