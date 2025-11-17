"use client";
import React, { useMemo, useState, useEffect } from "react";
import { clsx } from "clsx";
import type { Player, Match, ConfigWeights, StatRow } from "../lib/types";
import PlayersPanel from "../components/PlayersPanel";
import ConfigPanel from "../components/ConfigPanel";
import MatchesTable from "../components/MatchesTable";
import StatsTable from "../components/StatsTable";
import SwissSuggestion from "../components/SwissSuggestion";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_PLAYERS: Player[] = [];

const DEFAULT_CONFIG: ConfigWeights = {
  WIN_BONUS: 2,
  SET_WON_WEIGHT: 1,
  POINT_DIFF_WEIGHT: 0.05,
  RUBBER_WIN_BONUS: 0,
  STRAIGHT_WIN_BONUS: 0,
  LOSS_PARTICIPATION: 0,
};

export default function Page() {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [config, setConfig] = useState<ConfigWeights>(DEFAULT_CONFIG);
  const [matches, setMatches] = useState<Match[]>([]);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [courts, setCourts] = useState<number>(3);
  const steps = [
    { key: "players", title: "Players" },
    { key: "config", title: "Config" },
    { key: "round", title: "Round" },
    { key: "matches", title: "Matches" },
    { key: "stats", title: "Stats" },
    { key: "next", title: "Next Round" },
  ] as const;
  const [step, setStep] = useState<number>(0);

  const id2player = useMemo(() => Object.fromEntries(players.map((p) => [p.id, p])), [players]);

  // Sanitize odd text encoding artifacts post-hydration (mojibake fix)
  useEffect(() => {
    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const badPatterns: [RegExp, string][] = [
        [/A�/g, "- "],
        [/\?�\"/g, " - "],
        [/�oO�,\?/g, ""],
        [/�/g, ""],
      ];
      const nodes: Text[] = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode as Text);
      }
      for (const n of nodes) {
        let t = n.nodeValue || "";
        for (const [re, rep] of badPatterns) {
          t = t.replace(re, rep);
        }
        t = t.replace(/\s{2,}/g, " ").trim();
        n.nodeValue = t;
      }
    } catch {}
  }, []);

  function addPlayer(name: string) {
    if (!name?.trim()) return;
    setPlayers((ps) => [...ps, { id: uid(), name: name.trim() }]);
  }
  function removePlayer(id: string) {
    setPlayers((ps) => ps.filter((p) => p.id !== id));
  }
  function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function genRound1() {
    const ids = players.map((p) => p.id);
    const shuffled = shuffle(ids);
    const pairs: { A: [string, string]; B: [string, string] }[] = [];
    for (let i = 0; i + 3 < shuffled.length; i += 4) {
      pairs.push({ A: [shuffled[i], shuffled[i + 1]], B: [shuffled[i + 2], shuffled[i + 3]] });
    }
    const newMatches: Match[] = pairs.map((pr, idx) => ({
      id: uid(),
      round: 1,
      court: (idx % courts) + 1,
      teamA: pr.A,
      teamB: pr.B,
      sets: [
        { a: 0, b: 0 },
        { a: 0, b: 0 },
        { a: 0, b: 0 },
      ],
    }));
    setMatches((ms) => [...ms.filter((m) => m.round !== 1), ...newMatches]);
    setCurrentRound(1);
  }
  function setSetScore(matchId: string, setIdx: number, side: "a" | "b", val: string) {
    setMatches((ms) =>
      ms.map((m) => {
        if (m.id !== matchId) return m;
        const sets = m.sets.map((s, i) => (i === setIdx ? { ...s, [side]: Number(val) || 0 } : s));
        return { ...m, sets };
      })
    );
  }
  function setCourt(matchId: string, val: string) {
    setMatches((ms) => ms.map((m) => (m.id === matchId ? { ...m, court: Number(val) || "" } : m)));
  }

  function matchComputed(m: Match) {
    const s = m.sets;
    const setsWonA = (s[0].a > s[0].b ? 1 : 0) + (s[1].a > s[1].b ? 1 : 0) + (s[2].a > 0 || s[2].b > 0 ? (s[2].a > s[2].b ? 1 : 0) : 0);
    const setsWonB = (s[0].b > s[0].a ? 1 : 0) + (s[1].b > s[1].a ? 1 : 0) + (s[2].a > 0 || s[2].b > 0 ? (s[2].b > s[2].a ? 1 : 0) : 0);
    const pointsA = s[0].a + s[1].a + s[2].a;
    const pointsB = s[0].b + s[1].b + s[2].b;
    const winner = setsWonA === 0 && setsWonB === 0 ? "" : setsWonA > setsWonB ? "A" : setsWonB > setsWonA ? "B" : "";
    const thirdPlayed = s[2].a > 0 || s[2].b > 0;
    const isStraightA = winner === "A" && setsWonA === 2 && !thirdPlayed ? 1 : 0; // 2-0
    const isStraightB = winner === "B" && setsWonB === 2 && !thirdPlayed ? 1 : 0; // 2-0
    const isRubberA = winner === "A" && setsWonA === 2 && thirdPlayed ? 1 : 0; // 2-1
    const isRubberB = winner === "B" && setsWonB === 2 && thirdPlayed ? 1 : 0; // 2-1
    return { setsWonA, setsWonB, pointsA, pointsB, pointDiffA: pointsA - pointsB, pointDiffB: pointsB - pointsA, winner, isStraightA, isStraightB, isRubberA, isRubberB };
  }

  const stats: StatRow[] = useMemo(() => {
    const base: Record<string, StatRow> = Object.fromEntries(players.map((p) => [p.id, { playerId: p.id, name: p.name, MP: 0, W: 0, L: 0, SW: 0, SL: 0, PW: 0, PL: 0, PD: 0, RW: 0, STW: 0, score: 0 }]));
    for (const m of matches) {
      const c = matchComputed(m);
      const allIds = [...m.teamA, ...m.teamB];
      for (const id of allIds) {
        base[id].MP += 1;
      }
      if (c.winner === "A") {
        base[m.teamA[0]].W++;
        base[m.teamA[1]].W++;
        base[m.teamB[0]].L++;
        base[m.teamB[1]].L++;
      } else if (c.winner === "B") {
        base[m.teamB[0]].W++;
        base[m.teamB[1]].W++;
        base[m.teamA[0]].L++;
        base[m.teamA[1]].L++;
      }
      base[m.teamA[0]].SW += c.setsWonA;
      base[m.teamA[1]].SW += c.setsWonA;
      base[m.teamB[0]].SW += c.setsWonB;
      base[m.teamB[1]].SW += c.setsWonB;
      base[m.teamA[0]].SL += c.setsWonB;
      base[m.teamA[1]].SL += c.setsWonB;
      base[m.teamB[0]].SL += c.setsWonA;
      base[m.teamB[1]].SL += c.setsWonA;
      base[m.teamA[0]].PW += c.pointsA;
      base[m.teamA[1]].PW += c.pointsA;
      base[m.teamB[0]].PW += c.pointsB;
      base[m.teamB[1]].PW += c.pointsB;
      base[m.teamA[0]].PL += c.pointsB;
      base[m.teamA[1]].PL += c.pointsB;
      base[m.teamB[0]].PL += c.pointsA;
      base[m.teamB[1]].PL += c.pointsA;
      base[m.teamA[0]].PD += c.pointDiffA;
      base[m.teamA[1]].PD += c.pointDiffA;
      base[m.teamB[0]].PD += c.pointDiffB;
      base[m.teamB[1]].PD += c.pointDiffB;
      if (c.isRubberA) {
        base[m.teamA[0]].RW++;
        base[m.teamA[1]].RW++;
      }
      if (c.isRubberB) {
        base[m.teamB[0]].RW++;
        base[m.teamB[1]].RW++;
      }
      if (c.isStraightA) {
        base[m.teamA[0]].STW++;
        base[m.teamA[1]].STW++;
      }
      if (c.isStraightB) {
        base[m.teamB[0]].STW++;
        base[m.teamB[1]].STW++;
      }
    }
    for (const id in base) {
      const o = base[id];
      o.score = o.W * config.WIN_BONUS + o.SW * config.SET_WON_WEIGHT + o.PD * config.POINT_DIFF_WEIGHT + o.RW * config.RUBBER_WIN_BONUS + o.STW * config.STRAIGHT_WIN_BONUS + o.L * config.LOSS_PARTICIPATION;
    }
    const arr = Object.values(base).sort((a, b) => b.score - a.score || b.W - a.W || b.SW - b.SL - (a.SW - a.SL) || b.PD - a.PD);
    return arr;
  }, [players, matches, config]);

  const swissPairs = useMemo(() => {
    const ids = stats.map((s) => s.playerId);
    const pairs: { A: [string, string]; B: [string, string] }[] = [];
    for (let i = 0; i + 3 < ids.length; i += 4) {
      pairs.push({ A: [ids[i], ids[i + 1]], B: [ids[i + 2], ids[i + 3]] });
    }
    return pairs;
  }, [stats]);

  function acceptSwissAsRound(round: number) {
    const newMatches: Match[] = swissPairs.map((pr, idx) => ({
      id: uid(),
      round,
      court: (idx % courts) + 1,
      teamA: pr.A,
      teamB: pr.B,
      sets: [
        { a: 0, b: 0 },
        { a: 0, b: 0 },
        { a: 0, b: 0 },
      ],
    }));
    setMatches((ms) => [...ms, ...newMatches]);
    setCurrentRound(round);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-7xl mx-auto grid gap-6">
        <header className="flex items-center justify-between min-w-0">
          <h1 className="text-2xl font-bold break-words">Swiss Badminton Doubles · Individual Leaderboard</h1>
        </header>

        {/* Mobile-first stepper view (enabled on small screens) */}
        <div className="block lg:hidden">
          <nav className="bg-white rounded-2xl p-2 shadow-sm border">
            <div className="grid grid-cols-3 gap-2">
              {steps.map((s, i) => (
                <button key={s.key} onClick={() => setStep(i)} className={clsx("text-xs text-center px-3 py-1.5 rounded-full border", i === step ? "bg-black text-white border-black" : "bg-white text-gray-700")}>{`${i + 1}. ${
                  s.title
                }`}</button>
              ))}
            </div>
          </nav>

          {step === 0 && (
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold mb-2">Players</h2>
              <PlayersPanel players={players} addPlayer={addPlayer} removePlayer={removePlayer} />
            </section>
          )}
          {step === 1 && (
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold mb-2">Config Weights</h2>
              <ConfigPanel config={config} setConfig={setConfig} />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-sm">Courts</label>
                <input type="number" min={1} value={courts} onChange={(e) => setCourts(Number(e.target.value) || 1)} className="w-24 px-3 py-2 rounded-xl border" />
              </div>
            </section>
          )}
          {step === 2 && (
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold mb-2">Round Scheduler</h2>
              <div className="flex flex-col gap-2">
                <button onClick={genRound1} className="px-3 py-2 rounded-2xl bg-black text-white disabled:opacity-50" disabled={players.length < 4}>
                  Generate Round 1 (Shuffle)
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <input type="number" min={2} value={currentRound} onChange={(e) => setCurrentRound(Number(e.target.value) || 1)} className="w-24 px-3 py-2 rounded-xl border" />
                  <button onClick={() => acceptSwissAsRound(currentRound)} className="w-full sm:w-auto px-3 py-2 rounded-2xl border bg-white hover:shadow disabled:opacity-50" disabled={players.length < 4}>
                    Accept Swiss Pairs as Round {currentRound}
                  </button>
                </div>
                <p className="text-xs text-gray-500">Tip: input Round 1 scores before generating Round 2</p>
              </div>
            </section>
          )}
          {step === 3 && (
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold mb-3">Matches</h2>
              <MatchesTable matches={matches} id2player={id2player} setSetScore={setSetScore} setCourt={setCourt} />
            </section>
          )}
          {step === 4 && (
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold mb-3">Stats (Individual)</h2>
              <StatsTable stats={stats} />
            </section>
          )}
          {step === 5 && (
            <section className="bg-white rounded-2xl p-4 shadow-sm">
              <h2 className="font-semibold mb-3">Next Round (Swiss) - Suggested</h2>
              <SwissSuggestion pairs={swissPairs} id2player={id2player} />
            </section>
          )}

          <div className="flex justify-between">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="px-3 py-2 rounded-xl border bg-white disabled:opacity-40" disabled={step === 0}>
              Back
            </button>
            <button onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))} className="px-3 py-2 rounded-xl border bg-black text-white disabled:opacity-40" disabled={step === steps.length - 1}>
              Next
            </button>
          </div>
        </div>

        {/* Desktop/large layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-4">
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold mb-2">Players</h2>
            <PlayersPanel players={players} addPlayer={addPlayer} removePlayer={removePlayer} />
          </section>

          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold mb-2">Config Weights</h2>
            <ConfigPanel config={config} setConfig={setConfig} />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label className="text-sm">Courts</label>
              <input type="number" min={1} value={courts} onChange={(e) => setCourts(Number(e.target.value) || 1)} className="w-20 px-3 py-2 rounded-xl border" />
            </div>
          </section>

          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold mb-2">Round Scheduler</h2>
            <div className="flex flex-col gap-2">
              <button onClick={genRound1} className="px-3 py-2 rounded-2xl bg-black text-white hover:opacity-90">
                Generate Round 1 (Shuffle)
              </button>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <input type="number" min={2} value={currentRound} onChange={(e) => setCurrentRound(Number(e.target.value) || 1)} className="w-24 px-3 py-2 rounded-xl border" />
                <button onClick={() => acceptSwissAsRound(currentRound)} className="w-full sm:w-auto px-3 py-2 rounded-2xl border bg-white hover:shadow">
                  Accept Swiss Pairs as Round {currentRound}
                </button>
              </div>
              <p className="text-xs text-gray-500">Tip: isi skor Round 1 dulu biar SwissScore kebentuk sebelum generate Round 2</p>
            </div>
          </section>
        </div>

        <section className="hidden lg:block bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold mb-3">Matches</h2>
          <MatchesTable matches={matches} id2player={id2player} setSetScore={setSetScore} setCourt={setCourt} />
        </section>

        <div className="hidden lg:grid lg:grid-cols-2 gap-4">
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold mb-3">Stats (Individual)</h2>
            <StatsTable stats={stats} />
          </section>
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold mb-3">Next Round (Swiss) Suggested</h2>
            <SwissSuggestion pairs={swissPairs} id2player={id2player} />
          </section>
        </div>

        <footer className="text-center text-xs text-gray-500 py-6">Built by fahmi ramdhani</footer>
      </div>
    </div>
  );
}
