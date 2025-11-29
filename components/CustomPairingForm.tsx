"use client";
import React, { useMemo, useState } from "react";
import type { Player } from "../lib/types";
import { Button } from "./Button";

type Props = {
  players: Player[];
  onAdd: (payload: { round: number; court?: number | ""; teamA: [string, string]; teamB: [string, string] }) => void;
};

export default function CustomPairingForm({ players, onAdd }: Props) {
  const [round, setRound] = useState(1);
  const [court, setCourt] = useState<string>("");
  const [teamA1, setTeamA1] = useState("");
  const [teamA2, setTeamA2] = useState("");
  const [teamB1, setTeamB1] = useState("");
  const [teamB2, setTeamB2] = useState("");
  const [error, setError] = useState("");

  const hasPlayers = players.length >= 4;
  const options = useMemo(() => players.map((p) => ({ id: p.id, name: p.name })), [players]);

  function reset() {
    setTeamA1("");
    setTeamA2("");
    setTeamB1("");
    setTeamB2("");
    setCourt("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hasPlayers) return;
    if (!teamA1 || !teamA2 || !teamB1 || !teamB2) {
      setError("Select four players for both teams.");
      return;
    }
    const allIds = [teamA1, teamA2, teamB1, teamB2];
    if (new Set(allIds).size !== 4) {
      setError("Each player can only appear once per match.");
      return;
    }
    setError("");
    onAdd({
      round: Math.max(1, round),
      court: court === "" ? undefined : Number(court) || "",
      teamA: [teamA1, teamA2],
      teamB: [teamB1, teamB2],
    });
    reset();
  }

  return (
    <div className="border rounded-xl p-3 bg-gray-50">
      <div className="flex items-center justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm">Add custom pairing</h3>
        <span className="text-xs text-gray-500">Create matches manually</span>
      </div>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Round</span>
            <input
              type="number"
              min={1}
              value={round}
              onChange={(e) => setRound(Number(e.target.value) || 1)}
              className="px-3 py-2 rounded-lg border"
            />
          </label>
          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Court (optional)</span>
            <input
              type="number"
              min={1}
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="px-3 py-2 rounded-lg border"
            />
          </label>
          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Team A - Player 1</span>
            <select
              value={teamA1}
              onChange={(e) => setTeamA1(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              disabled={!hasPlayers}
            >
              <option value="" disabled>
                Select player
              </option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Team A - Player 2</span>
            <select
              value={teamA2}
              onChange={(e) => setTeamA2(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              disabled={!hasPlayers}
            >
              <option value="" disabled>
                Select player
              </option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Team B - Player 1</span>
            <select
              value={teamB1}
              onChange={(e) => setTeamB1(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              disabled={!hasPlayers}
            >
              <option value="" disabled>
                Select player
              </option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm flex flex-col gap-1">
            <span className="text-gray-600">Team B - Player 2</span>
            <select
              value={teamB2}
              onChange={(e) => setTeamB2(e.target.value)}
              className="px-3 py-2 rounded-lg border"
              disabled={!hasPlayers}
            >
              <option value="" disabled>
                Select player
              </option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 justify-end">
          <Button type="submit" className="w-full sm:w-auto" disabled={!hasPlayers}>
            Add custom match
          </Button>
          {!hasPlayers && <span className="text-xs text-gray-500">Need at least 4 players.</span>}
        </div>
      </form>
    </div>
  );
}
