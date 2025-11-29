import unittest

from round_robbin_generator import RoundRobbinGenerator


class RoundRobbinGeneratorTest(unittest.TestCase):
    def test_add_and_remove_player(self):
        generator = RoundRobbinGenerator(["Alice", "Bob"])
        generator.add_player("Charlie")
        self.assertIn("Charlie", generator.players)
        generator.remove_player("Charlie")
        self.assertNotIn("Charlie", generator.players)

    def test_remove_missing_player_raises(self):
        generator = RoundRobbinGenerator(["Alice"])
        with self.assertRaises(ValueError):
            generator.remove_player("Bob")

    def test_generate_schedule_even_players(self):
        generator = RoundRobbinGenerator(["Alice", "Bob", "Charlie", "Dana"])
        schedule = generator.generate_schedule()
        self.assertEqual(len(schedule), 3)
        # Ensure every round has two matches with no duplicates
        for round_pairings in schedule:
            self.assertEqual(len(round_pairings), 2)
            self.assertEqual(len({player for pairing in round_pairings for player in pairing}), 4)

    def test_generate_schedule_odd_players_uses_bye(self):
        generator = RoundRobbinGenerator(["Alice", "Bob", "Charlie"])
        schedule = generator.generate_schedule()
        self.assertEqual(len(schedule), 3)
        # Each round should have one matchup because of the bye.
        for round_pairings in schedule:
            self.assertEqual(len(round_pairings), 1)


if __name__ == "__main__":
    unittest.main()
