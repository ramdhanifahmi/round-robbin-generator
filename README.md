# round-robbin-generator

Simple round robin tournament helper with support for adding and removing players.

## Usage

```python
from round_robbin_generator import RoundRobbinGenerator

generator = RoundRobbinGenerator(["Alice", "Bob", "Charlie"])
generator.remove_player("Charlie")

generator.add_player("Dana")
schedule = generator.generate_schedule()
print(schedule)
```

## Development

Run the test suite with:

```bash
python -m unittest discover -s tests -p 'test_*.py' -v
```
