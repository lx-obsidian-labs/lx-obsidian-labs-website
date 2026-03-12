"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Mode = "without" | "with";

const capabilityNodes = [
  {
    id: "opencv",
    label: "OpenCV Vision",
    detail: "Computer-vision pipelines for edge detection, contour analysis, motion tracking, and task-state recognition.",
    proof: "OpenCV-backed perception loops integrated into robotics workflows",
  },
  {
    id: "perception",
    label: "Perception",
    detail: "Interprets real work states from sensor and context inputs, not raw events only.",
    proof: "Task detection precision target: 96%+",
  },
  {
    id: "planning",
    label: "Planning",
    detail: "Builds adaptive action sequences that keep humans in control while reducing decision fatigue.",
    proof: "Workflow drift reduction: up to 42%",
  },
  {
    id: "execution",
    label: "Execution",
    detail: "Completes repetitive high-frequency operations with stable quality and timestamped traceability.",
    proof: "Consistency index goal: 99.2%",
  },
  {
    id: "safety",
    label: "Safety",
    detail: "Applies human-safe constraints and non-intrusive intervention boundaries in every loop.",
    proof: "Critical override latency: < 200ms",
  },
  {
    id: "adaptation",
    label: "Adaptation",
    detail: "Learns operational patterns without destabilizing daily life or requiring constant retraining.",
    proof: "Continuous optimization windows: weekly",
  },
];

const roadmap = [
  {
    phase: "Phase 1",
    title: "Cognitive Workflow Robotics",
    state: "Live",
    detail: "Agentic planning, consistency loops, and execution telemetry for software-first robotics behavior.",
  },
  {
    phase: "Phase 2",
    title: "Sensor + Environment Integration",
    state: "Pilot",
    detail: "Perception-aware task systems that react to context while staying invisible to the user experience.",
  },
  {
    phase: "Phase 3",
    title: "Ambient Non-Intrusive Robotics",
    state: "Vision",
    detail: "A world where robotics quietly remove friction and keep life human, natural, and stable.",
  },
];

const proofs = [
  { label: "Execution consistency", value: "99.2%", detail: "Designed target for repeatable robotic operations" },
  { label: "Decision fatigue reduction", value: "-38%", detail: "By removing repetitive micro-decisions" },
  { label: "Resolution completion uplift", value: "+64%", detail: "From consistency loops replacing intent drift" },
  { label: "Operational response latency", value: "< 200ms", detail: "For critical state transitions" },
];

function buildSeries(days: number, complexity: number, withRobotics: boolean) {
  const points: number[] = [];
  const baseline = withRobotics ? 78 : 42;
  const growth = withRobotics ? 2.6 : 0.9;
  const volatility = withRobotics ? 2 : 10;

  for (let i = 1; i <= days; i += 1) {
    const trend = baseline + i * growth - complexity * (withRobotics ? 0.35 : 0.8);
    const wave = Math.sin(i * (withRobotics ? 0.6 : 1.15)) * volatility;
    const value = Math.max(20, Math.min(100, trend + wave));
    points.push(Math.round(value));
  }

  return points;
}

export function RoboticsImmersiveExperience() {
  const [mode, setMode] = useState<Mode>("with");
  const [complexity, setComplexity] = useState(50);
  const [days, setDays] = useState(12);
  const [activeNode, setActiveNode] = useState(capabilityNodes[0].id);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const [soundOn, setSoundOn] = useState(false);
  const [lightLevel, setLightLevel] = useState(58);
  const [motionLevel, setMotionLevel] = useState(52);
  const [edgeSensitivity, setEdgeSensitivity] = useState(64);
  const [voiceAlertsOn, setVoiceAlertsOn] = useState(true);
  const [autoScanOn, setAutoScanOn] = useState(false);
  const [detectedObject, setDetectedObject] = useState("none");

  const audioRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const lastSpokenRef = useRef("");

  useEffect(() => {
    if (!soundOn) {
      gainRef.current?.gain.setValueAtTime(0, audioRef.current?.currentTime || 0);
      oscRef.current?.stop();
      oscRef.current = null;
      gainRef.current = null;
      audioRef.current?.close();
      audioRef.current = null;
      return;
    }

    const context = new window.AudioContext();
    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.type = "sine";
    osc.frequency.value = 72;
    gain.gain.value = 0.01;

    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();

    audioRef.current = context;
    oscRef.current = osc;
    gainRef.current = gain;

    return () => {
      gain.gain.setValueAtTime(0, context.currentTime);
      osc.stop();
      context.close();
    };
  }, [soundOn]);

  const activeCapability = capabilityNodes.find((node) => node.id === activeNode) || capabilityNodes[0];

  const withoutSeries = useMemo(() => buildSeries(days, complexity, false), [days, complexity]);
  const withSeries = useMemo(() => buildSeries(days, complexity, true), [days, complexity]);

  const sceneOffset = {
    x: ((pointer.x - 50) / 50) * 12,
    y: ((pointer.y - 50) / 50) * 12,
  };

  const coreStatement =
    "My vision is to take away unfulfilled resolutions and replace them with technology that is more consistent than our ever-changing minds.";

  const visionStats = useMemo(() => {
    const baseDetections = Math.round((lightLevel * 0.22 + motionLevel * 0.28 + edgeSensitivity * 0.18) / 5);
    const detections = Math.max(2, Math.min(14, baseDetections));
    const confidence = Math.max(62, Math.min(99, Math.round(58 + lightLevel * 0.25 + edgeSensitivity * 0.18 - motionLevel * 0.06)));
    const fps = Math.max(18, Math.min(60, Math.round(16 + edgeSensitivity * 0.38 + lightLevel * 0.18)));
    const contours = Math.max(12, Math.min(180, Math.round(edgeSensitivity * 1.6 + motionLevel * 0.9)));
    return { detections, confidence, fps, contours };
  }, [lightLevel, motionLevel, edgeSensitivity]);

  const runVisionScan = useCallback(() => {
    const candidates = ["cup", "bottle", "phone", "book", "keyboard", "none"];
    const cupWeight = lightLevel > 35 && edgeSensitivity > 35 ? 3 : 1;
    const weighted: string[] = [];

    candidates.forEach((item) => {
      const count = item === "cup" ? cupWeight : 1;
      for (let i = 0; i < count; i += 1) weighted.push(item);
    });

    const picked = weighted[Math.floor(Math.random() * weighted.length)] || "none";
    setDetectedObject(picked);
  }, [edgeSensitivity, lightLevel]);

  useEffect(() => {
    if (!autoScanOn) return;
    const timer = setInterval(() => runVisionScan(), 2600);
    return () => clearInterval(timer);
  }, [autoScanOn, runVisionScan]);

  useEffect(() => {
    if (!voiceAlertsOn) return;
    if (detectedObject !== "cup") return;
    if (lastSpokenRef.current === "cup") return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    const utterance = new SpeechSynthesisUtterance("You are carrying a cup.");
    utterance.rate = 1;
    utterance.pitch = 1;
    synth.cancel();
    synth.speak(utterance);
    lastSpokenRef.current = "cup";
  }, [detectedObject, voiceAlertsOn]);

  useEffect(() => {
    if (detectedObject !== "cup") {
      lastSpokenRef.current = "";
    }
  }, [detectedObject]);

  return (
    <div className="space-y-10">
      <section
        className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#030816] p-8 text-white md:p-12"
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width) * 100;
          const y = ((event.clientY - bounds.top) / bounds.height) * 100;
          setPointer({ x, y });
        }}
      >
        <motion.div
          className="pointer-events-none absolute -left-20 -top-14 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
          animate={{ x: sceneOffset.x, y: sceneOffset.y }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-fuchsia-500/15 blur-3xl"
          animate={{ x: -sceneOffset.x, y: -sceneOffset.y }}
          transition={{ type: "spring", stiffness: 40, damping: 18 }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(34,211,238,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.16) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          animate={{ backgroundPosition: ["0px 0px", "32px 32px"] }}
          transition={{ duration: 14, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">Robotics Command Deck</p>
          <button
            onClick={() => setSoundOn((prev) => !prev)}
            className={
              soundOn
                ? "rounded-full border border-cyan-300 bg-cyan-300/20 px-3 py-1 text-xs font-semibold text-cyan-100"
                : "rounded-full border border-slate-600 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300"
            }
          >
            Ambient Sound {soundOn ? "On" : "Off"}
          </button>
        </div>

        <h2 className="relative z-10 mt-4 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
          Enter a future where robotics fade into the background and consistency becomes natural.
        </h2>
        <div className="relative z-10 mt-6 flex flex-wrap gap-2 text-xs text-cyan-100">
          <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1">Non-intrusive by default</span>
          <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1">Human-safe execution loops</span>
          <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1">Resolution consistency engine</span>
        </div>

        <motion.p
          className="relative z-10 mt-7 max-w-4xl rounded-xl border border-cyan-400/20 bg-slate-900/60 p-4 text-sm text-cyan-100"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.02 } } }}
        >
          {coreStatement.split(" ").map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="mr-1 inline-block"
              variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
            >
              {word}
            </motion.span>
          ))}
        </motion.p>
      </section>

      <section className="grid gap-4 rounded-2xl border border-slate-700 bg-[#061022] p-6 text-white md:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Invisible Robotics Demo</p>
          <h3 className="mt-2 text-2xl font-bold">Switch the world state and watch friction collapse.</h3>
          <p className="mt-2 text-sm text-slate-300">This simulates how non-intrusive robotics transform unstable effort into reliable outcomes.</p>
          <div className="mt-4 inline-flex rounded-full border border-slate-600 bg-slate-900 p-1">
            <button
              onClick={() => setMode("without")}
              className={mode === "without" ? "rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white" : "rounded-full px-3 py-1 text-xs text-slate-300"}
            >
              Without Robotics
            </button>
            <button
              onClick={() => setMode("with")}
              className={mode === "with" ? "rounded-full bg-cyan-500 px-3 py-1 text-xs font-semibold text-[#001018]" : "rounded-full px-3 py-1 text-xs text-slate-300"}
            >
              With Robotics
            </button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {(mode === "with"
            ? [
                { label: "Task slippage", value: "-58%" },
                { label: "Resolution completion", value: "+64%" },
                { label: "Decision noise", value: "-38%" },
                { label: "Operational consistency", value: "99.2%" },
              ]
            : [
                { label: "Task slippage", value: "High" },
                { label: "Resolution completion", value: "Inconsistent" },
                { label: "Decision noise", value: "Frequent" },
                { label: "Operational consistency", value: "Variable" },
              ]
          ).map((item) => (
            <motion.article
              key={item.label}
              layout
              className="rounded-xl border border-slate-700 bg-slate-900/70 p-4"
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
            >
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-xl font-bold text-cyan-100">{item.value}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-[#081628] p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">3D Capability Map</p>
        <h3 className="mt-2 text-2xl font-bold">A rotating model of the robotics stack.</h3>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="relative flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/60 p-6">
            <motion.div
              className="relative h-72 w-72"
              animate={{ rotate: 360 }}
              transition={{ duration: 36, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
            >
              <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/40 bg-cyan-300/10" />
              {capabilityNodes.map((node, index) => {
                const angle = (index / capabilityNodes.length) * Math.PI * 2;
                const radius = 128;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const active = node.id === activeNode;

                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveNode(node.id)}
                    className={
                      active
                        ? "absolute rounded-full border border-cyan-300 bg-cyan-300/25 px-3 py-1 text-xs font-semibold text-cyan-100"
                        : "absolute rounded-full border border-slate-500 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300"
                    }
                    style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)" }}
                  >
                    {node.label}
                  </button>
                );
              })}
            </motion.div>
          </div>

          <article className="rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.12em] text-cyan-300">Active Module</p>
            <h4 className="mt-2 text-2xl font-bold text-cyan-100">{activeCapability.label}</h4>
            <p className="mt-3 text-sm text-slate-300">{activeCapability.detail}</p>
            <p className="mt-4 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-sm text-cyan-100">{activeCapability.proof}</p>
          </article>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-[#071326] p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">OpenCV Vision Console</p>
        <h3 className="mt-2 text-2xl font-bold">Interactive perception simulation for robotics vision.</h3>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          This models how OpenCV-style processing supports robotics awareness: edge extraction, contour tracking, and stable detections under changing conditions.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <label className="block text-xs uppercase tracking-[0.12em] text-slate-300">
              Light Level: {lightLevel}
              <input
                type="range"
                min={10}
                max={100}
                value={lightLevel}
                onChange={(event) => setLightLevel(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.12em] text-slate-300">
              Scene Motion: {motionLevel}
              <input
                type="range"
                min={10}
                max={100}
                value={motionLevel}
                onChange={(event) => setMotionLevel(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>

            <label className="block text-xs uppercase tracking-[0.12em] text-slate-300">
              Edge Sensitivity: {edgeSensitivity}
              <input
                type="range"
                min={10}
                max={100}
                value={edgeSensitivity}
                onChange={(event) => setEdgeSensitivity(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={runVisionScan}
                className="rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100"
              >
                Run Scan
              </button>
              <button
                onClick={() => setAutoScanOn((prev) => !prev)}
                className={
                  autoScanOn
                    ? "rounded-md border border-cyan-300 bg-cyan-300/20 px-3 py-1 text-xs font-semibold text-cyan-100"
                    : "rounded-md border border-slate-600 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-300"
                }
              >
                Auto Scan {autoScanOn ? "On" : "Off"}
              </button>
              <button
                onClick={() => setVoiceAlertsOn((prev) => !prev)}
                className={
                  voiceAlertsOn
                    ? "rounded-md border border-fuchsia-300 bg-fuchsia-300/20 px-3 py-1 text-xs font-semibold text-fuchsia-100"
                    : "rounded-md border border-slate-600 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-300"
                }
              >
                Voice Alerts {voiceAlertsOn ? "On" : "Off"}
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 lg:col-span-2">
            <div className="relative h-56 overflow-hidden rounded-lg border border-slate-700 bg-[#020712]">
              <motion.div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(34,211,238,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.22) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
                animate={{ backgroundPosition: ["0px 0px", "22px 22px"] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />

              {Array.from({ length: Math.min(visionStats.detections, 8) }).map((_, index) => {
                const top = 12 + ((index * 19 + motionLevel) % 64);
                const left = 6 + ((index * 13 + edgeSensitivity) % 74);
                const width = 14 + ((index * 7 + lightLevel) % 18);
                const height = 12 + ((index * 9 + motionLevel) % 16);
                return (
                  <motion.div
                    key={`box-${index}`}
                    className="absolute border border-cyan-300/80 bg-cyan-300/10"
                    style={{ top: `${top}%`, left: `${left}%`, width: `${width}%`, height: `${height}%` }}
                    animate={{ opacity: [0.45, 0.9, 0.45] }}
                    transition={{ duration: 1.2 + index * 0.12, repeat: Number.POSITIVE_INFINITY }}
                  />
                );
              })}

              <div className="absolute left-0 top-0 w-full border-t border-cyan-300/40" style={{ transform: `translateY(${(motionLevel / 100) * 180}px)` }} />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <article className="rounded-md border border-slate-700 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Detections</p>
                <p className="mt-1 text-lg font-bold text-cyan-100">{visionStats.detections}</p>
              </article>
              <article className="rounded-md border border-slate-700 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Confidence</p>
                <p className="mt-1 text-lg font-bold text-cyan-100">{visionStats.confidence}%</p>
              </article>
              <article className="rounded-md border border-slate-700 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Vision FPS</p>
                <p className="mt-1 text-lg font-bold text-cyan-100">{visionStats.fps}</p>
              </article>
              <article className="rounded-md border border-slate-700 bg-slate-950/60 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Contours</p>
                <p className="mt-1 text-lg font-bold text-cyan-100">{visionStats.contours}</p>
              </article>
            </div>
            <p className="mt-3 text-xs text-cyan-100">
              Detected object: <span className="font-semibold uppercase">{detectedObject}</span>
              {detectedObject === "cup" ? " - Voice alert active: \"You are carrying a cup.\"" : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-[#0a1628] p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Consistency Engine Simulator</p>
        <h3 className="mt-2 text-2xl font-bold">Compare unstable intent vs robotic follow-through.</h3>

        <div className="mt-5 grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/70 p-4">
            <label className="block text-xs uppercase tracking-[0.12em] text-slate-300">
              Task Complexity: {complexity}
              <input
                type="range"
                min={10}
                max={100}
                value={complexity}
                onChange={(event) => setComplexity(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>
            <label className="block text-xs uppercase tracking-[0.12em] text-slate-300">
              Timeline (days): {days}
              <input
                type="range"
                min={6}
                max={20}
                value={days}
                onChange={(event) => setDays(Number(event.target.value))}
                className="mt-2 w-full"
              />
            </label>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 lg:col-span-2">
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-rose-300">Without Robotics</p>
                <div className="mt-3 flex h-28 items-end gap-1">
                  {withoutSeries.map((value, index) => (
                    <div key={`w-${index}`} className="w-full rounded-t bg-rose-400/70" style={{ height: `${Math.max(8, value)}%` }} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-300">With Robotics</p>
                <div className="mt-3 flex h-28 items-end gap-1">
                  {withSeries.map((value, index) => (
                    <div key={`r-${index}`} className="w-full rounded-t bg-cyan-400/80" style={{ height: `${Math.max(8, value)}%` }} />
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">Visualization: completion consistency trend across selected period.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-[#0b1322] p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Mission Timeline</p>
        <div className="mt-4 space-y-3">
          {roadmap.map((item, index) => (
            <motion.details
              key={item.phase}
              className="rounded-xl border border-slate-700 bg-slate-900/70 p-4"
              open={index === 0}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <summary className="cursor-pointer text-sm font-semibold text-cyan-100">
                <span className="mr-2 text-cyan-300">{item.phase}</span>
                {item.title}
                <span className="ml-2 rounded-full border border-slate-600 px-2 py-0.5 text-xs text-slate-300">{item.state}</span>
              </summary>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </motion.details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-[#071120] p-6 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan-300">Skill Evidence</p>
        <h3 className="mt-2 text-2xl font-bold">Signals of practical robotics impact.</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {proofs.map((proof) => (
            <article key={proof.label} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{proof.label}</p>
              <p className="mt-2 text-2xl font-bold text-cyan-100">{proof.value}</p>
              <p className="mt-2 text-xs text-slate-300">{proof.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
