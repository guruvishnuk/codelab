from sqlalchemy.orm import Session
from .models import Topic, Exercise

PYTHON_BASICS_NOTES = """
## Variables and input

A variable is a name that points to a value.

```python
name = "Asha"
age = 21
print(name, age)
```

Use `input()` to read a line of text. It always returns a string, so convert it when you need a number:

```python
x = int(input())
print(x * 2)
```

## Printing

`print()` writes a line to the output. Use an f-string to mix text and values:

```python
print(f"Hello, {name}!")
```
"""

CONTROL_FLOW_NOTES = """
## if / else

```python
n = int(input())
if n % 2 == 0:
    print("even")
else:
    print("odd")
```

## for loops

`range(1, n + 1)` gives the numbers 1 through n.

```python
total = 0
for i in range(1, 6):
    total += i
print(total)  # 15
```
"""


def seed(db: Session) -> None:
    if db.query(Topic).count() > 0:
        return

    basics = Topic(
        slug="python-basics", title="Python basics", position=1,
        summary="Variables, input and output.", notes_md=PYTHON_BASICS_NOTES,
        exercises=[
            Exercise(
                title="Add two numbers", difficulty="easy", position=1,
                prompt_md="Read two integers (one per line) and print their sum.",
                starter_code="a = int(input())\nb = int(input())\n# print the sum\n",
                test_cases=[{"input": "2\n3\n", "expected": "5"},
                            {"input": "10\n-4\n", "expected": "6"}],
            ),
            Exercise(
                title="Greet someone", difficulty="easy", position=2,
                prompt_md="Read a name and print `Hello, <name>!`",
                starter_code="name = input()\n",
                test_cases=[{"input": "Asha\n", "expected": "Hello, Asha!"},
                            {"input": "Ravi\n", "expected": "Hello, Ravi!"}],
            ),
        ],
    )
    flow = Topic(
        slug="control-flow", title="Control flow", position=2,
        summary="Decisions and loops.", notes_md=CONTROL_FLOW_NOTES,
        exercises=[
            Exercise(
                title="Even or odd", difficulty="easy", position=1,
                prompt_md="Read an integer. Print `even` or `odd`.",
                starter_code="n = int(input())\n",
                test_cases=[{"input": "4\n", "expected": "even"},
                            {"input": "7\n", "expected": "odd"}],
            ),
            Exercise(
                title="Sum up to n", difficulty="medium", position=2,
                prompt_md="Read `n` and print the sum of 1 + 2 + ... + n.",
                starter_code="n = int(input())\n",
                test_cases=[{"input": "5\n", "expected": "15"},
                            {"input": "100\n", "expected": "5050"}],
            ),
        ],
    )
    db.add_all([basics, flow])
    db.commit()
