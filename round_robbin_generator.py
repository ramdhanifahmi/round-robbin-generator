from __future__ import annotations
from typing import Iterable, List, Sequence, Tuple


class RoundRobbinGenerator:
    """Manage players and generate round robin matchups."""

    def __init__(self, players: Iterable[str] | None = None) -> None:
        self._players: List[str] = []
        if players:
            for player in players:
                self.add_player(player)

    @property
    def players(self) -> Sequence[str]:
        return tuple(self._players)

    def add_player(self, player: str) -> None:
        if player in self._players:
            raise ValueError(f"Player '{player}' is already registered.")
        self._players.append(player)

    def remove_player(self, player: str) -> None:
        """Remove a player by name.

        Raises:
            ValueError: If the player is not currently registered.
        """

        try:
            self._players.remove(player)
        except ValueError as exc:  # re-raise with clearer context
            raise ValueError(f"Player '{player}' is not registered.") from exc

    def generate_schedule(self) -> List[List[Tuple[str, str]]]:
        """Return a schedule of pairings for a round robin tournament.

        A bye placeholder is used when the number of players is odd; bye
        matchups are omitted from the output schedule.
        """

        if len(self._players) < 2:
            return []

        players = list(self._players)
        bye_placeholder = "BYE"
        if len(players) % 2 == 1:
            players.append(bye_placeholder)

        num_players = len(players)
        rounds: List[List[Tuple[str, str]]] = []
        for _ in range(num_players - 1):
            pairs: List[Tuple[str, str]] = []
            for idx in range(num_players // 2):
                home = players[idx]
                away = players[num_players - idx - 1]
                if bye_placeholder not in (home, away):
                    pairs.append((home, away))
            rounds.append(pairs)
            players = [players[0]] + players[-1:] + players[1:-1]

        return rounds
