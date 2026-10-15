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

STRINGS_NOTES = """
## Indexing and slicing

A string is a sequence of characters. Use square brackets to access individual
characters or slices:

```python
word = "hello"
print(word[0])    # h
print(word[-1])   # o
print(word[1:4])  # ell
print(word[::-1]) # olleh  (reversed)
```

## Useful string methods

`len(s)` returns the number of characters. `.lower()` converts to lowercase,
which is handy for case-insensitive comparisons:

```python
s = "Hello"
print(len(s))       # 5
print(s.lower())    # hello
```

## Checking characters

Loop through a string and test each character:

```python
vowels = "aeiou"
count = 0
for ch in "apple":
    if ch.lower() in vowels:
        count += 1
print(count)  # 2
```
"""

FUNCTIONS_NOTES = """
## Defining Functions

Functions allow you to package reusable logic under a descriptive name using the `def` keyword:

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Asha")
print(message)  # Hello, Asha!
```

## `return` vs `print()`

A function produces a result with `return`. This lets callers capture, transform, or pass that result around.
If a function ends without a `return` statement, it implicitly returns `None`.

```python
def add(a, b):
    return a + b

result = add(3, 4) * 2  # 14
```

## Parameters and Default Arguments

You can provide default values for parameters, making them optional when called:

```python
def power(base, exponent=2):
    return base ** exponent

print(power(5))     # 25 (uses default exponent=2)
print(power(2, 3))  # 8  (overrides default)
```

## Variable Scope

Variables declared inside a function are **local** to that function. They cannot be accessed outside:

```python
def compute():
    secret = 42
    return secret

compute()
# print(secret)  # NameError: name 'secret' is not defined
```
"""

LISTS_AND_TUPLES_NOTES = """
## Lists

A list is an ordered, mutable collection of items defined with square brackets `[]`:

```python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")       # add item to end
print(fruits[0])            # apple (first item)
print(fruits[-1])           # date (last item)
print(fruits[1:3])          # ['banana', 'cherry'] (slicing)
```

## Useful List Operations

```python
numbers = [4, 1, 9, 2]
print(len(numbers))         # 4
print(sum(numbers))         # 16
print(min(numbers))         # 1
print(max(numbers))         # 9

numbers.sort()              # sorts list in-place: [1, 2, 4, 9]
```

## List Comprehensions

List comprehensions provide a concise way to create new lists by transforming or filtering elements:

```python
nums = [1, 2, 3, 4, 5]
evens = [x for x in nums if x % 2 == 0]     # [2, 4]
squares = [x * x for x in nums]             # [1, 4, 9, 16, 25]
```

## Tuples

Tuples are ordered collections defined with parentheses `()`. Unlike lists, tuples are **immutable** (cannot be modified after creation):

```python
point = (10, 20)
# point[0] = 15  # TypeError: 'tuple' object does not support item assignment

# Unpacking tuples
x, y = point
print(x, y)  # 10 20
```
"""

DICTIONARIES_AND_SETS_NOTES = """
## Dictionaries

Dictionaries store data as key-value pairs using curly braces `{}`. Keys must be unique and immutable (like strings or numbers):

```python
student = {"name": "Asha", "score": 95, "passed": True}
print(student["name"])          # Asha

# Safe access with .get()
print(student.get("age", 0))    # 0 (fallback if key doesn't exist)

# Adding or updating keys
student["grade"] = "A"
```

## Iterating Over Dictionaries

```python
scores = {"Alice": 90, "Bob": 85}

for name, score in scores.items():
    print(f"{name}: {score}")
```

## Counting with Dictionaries

A common pattern is counting item frequencies:

```python
words = ["apple", "banana", "apple", "cherry"]
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
# counts -> {'apple': 2, 'banana': 1, 'cherry': 1}
```

## Sets

Sets are unordered collections of **unique** elements:

```python
primes = {2, 3, 5, 7, 2, 3}
print(primes)  # {2, 3, 5, 7}  (duplicates removed)

# Set operations
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a & b)  # {3, 4} (intersection: in both)
print(a | b)  # {1, 2, 3, 4, 5, 6} (union: in either)
print(a - b)  # {1, 2} (difference: in a but not b)
```
"""

def get_topics_data() -> list[dict]:
    return [
        {
            "slug": "python-basics",
            "title": "Python basics",
            "position": 1,
            "summary": "Variables, input and output.",
            "notes_md": PYTHON_BASICS_NOTES,
            "exercises": [
                {
                    "title": "Add two numbers",
                    "difficulty": "easy",
                    "position": 1,
                    "prompt_md": "Read two integers (one per line) and print their sum.",
                    "starter_code": "a = int(input())\nb = int(input())\n# print the sum\n",
                    "test_cases": [
                        {"input": "2\n3\n", "expected": "5"},
                        {"input": "10\n-4\n", "expected": "6"},
                    ],
                },
                {
                    "title": "Greet someone",
                    "difficulty": "easy",
                    "position": 2,
                    "prompt_md": "Read a name and print `Hello, <name>!`",
                    "starter_code": "name = input()\n",
                    "test_cases": [
                        {"input": "Asha\n", "expected": "Hello, Asha!"},
                        {"input": "Ravi\n", "expected": "Hello, Ravi!"},
                    ],
                },
            ],
        },
        {
            "slug": "control-flow",
            "title": "Control flow",
            "position": 2,
            "summary": "Decisions and loops.",
            "notes_md": CONTROL_FLOW_NOTES,
            "exercises": [
                {
                    "title": "Even or odd",
                    "difficulty": "easy",
                    "position": 1,
                    "prompt_md": "Read an integer. Print `even` or `odd`.",
                    "starter_code": "n = int(input())\n",
                    "test_cases": [
                        {"input": "4\n", "expected": "even"},
                        {"input": "7\n", "expected": "odd"},
                    ],
                },
                {
                    "title": "Sum up to n",
                    "difficulty": "medium",
                    "position": 2,
                    "prompt_md": "Read `n` and print the sum of 1 + 2 + ... + n.",
                    "starter_code": "n = int(input())\n",
                    "test_cases": [
                        {"input": "5\n", "expected": "15"},
                        {"input": "100\n", "expected": "5050"},
                    ],
                },
            ],
        },
        {
            "slug": "strings",
            "title": "Strings",
            "position": 3,
            "summary": "Slicing, reversing and checking characters.",
            "notes_md": STRINGS_NOTES,
            "exercises": [
                {
                    "title": "Reverse a string",
                    "difficulty": "easy",
                    "position": 1,
                    "prompt_md": "Read a string and print it reversed.",
                    "starter_code": "s = input()\n# print s reversed\n",
                    "test_cases": [
                        {"input": "hello\n", "expected": "olleh"},
                        {"input": "Python\n", "expected": "nohtyP"},
                        {"input": "\n", "expected": ""},
                    ],
                },
                {
                    "title": "Count vowels",
                    "difficulty": "easy",
                    "position": 2,
                    "prompt_md": "Read a string and print how many vowels (a, e, i, o, u) it contains. Count both uppercase and lowercase.",
                    "starter_code": "s = input()\n# count and print vowels\n",
                    "test_cases": [
                        {"input": "hello\n", "expected": "2"},
                        {"input": "APPLE\n", "expected": "2"},
                        {"input": "xyz\n", "expected": "0"},
                    ],
                },
            ],
        },
        {
            "slug": "functions-and-scope",
            "title": "Functions & Scope",
            "position": 4,
            "summary": "Defining functions, return values, parameters, and scope.",
            "notes_md": FUNCTIONS_NOTES,
            "exercises": [
                {
                    "title": "Celsius to Fahrenheit",
                    "difficulty": "easy",
                    "position": 1,
                    "prompt_md": "Write a function `to_fahrenheit(c)` that takes a Celsius integer and returns the Fahrenheit temperature as an integer using `int(c * 9 / 5 + 32)`. Read an integer Celsius from input, call the function, and print the result.",
                    "starter_code": "def to_fahrenheit(c: int) -> int:\n    # return the temperature in Fahrenheit as an int\n    pass\n\ncelsius = int(input())\nprint(to_fahrenheit(celsius))\n",
                    "test_cases": [
                        {"input": "0\n", "expected": "32"},
                        {"input": "100\n", "expected": "212"},
                        {"input": "-40\n", "expected": "-40"},
                    ],
                },
                {
                    "title": "Max of Three",
                    "difficulty": "easy",
                    "position": 2,
                    "prompt_md": "Write a function `max_of_three(a, b, c)` that takes three integers and returns the largest among them without using Python's built-in `max()`. Read three integers (one per line) from input, call `max_of_three`, and print the result.",
                    "starter_code": "def max_of_three(a: int, b: int, c: int) -> int:\n    # return the largest of a, b, and c\n    pass\n\nx = int(input())\ny = int(input())\nz = int(input())\nprint(max_of_three(x, y, z))\n",
                    "test_cases": [
                        {"input": "5\n12\n9\n", "expected": "12"},
                        {"input": "-10\n-3\n-50\n", "expected": "-3"},
                        {"input": "7\n7\n7\n", "expected": "7"},
                    ],
                },
                {
                    "title": "Is Prime Number",
                    "difficulty": "medium",
                    "position": 3,
                    "prompt_md": "Write a function `is_prime(n)` that returns `True` if integer `n` is prime, and `False` otherwise. (A prime number is greater than 1 and divisible only by 1 and itself). Read an integer from input and print `is_prime(n)`.",
                    "starter_code": "def is_prime(n: int) -> bool:\n    # return True if n is prime, else False\n    pass\n\nnum = int(input())\nprint(is_prime(num))\n",
                    "test_cases": [
                        {"input": "7\n", "expected": "True"},
                        {"input": "1\n", "expected": "False"},
                        {"input": "12\n", "expected": "False"},
                        {"input": "29\n", "expected": "True"},
                    ],
                },
            ],
        },
        {
            "slug": "lists-and-tuples",
            "title": "Lists & Tuples",
            "position": 5,
            "summary": "Ordered collections, indexing, slicing, and immutability.",
            "notes_md": LISTS_AND_TUPLES_NOTES,
            "exercises": [
                {
                    "title": "Filter Even Numbers",
                    "difficulty": "easy",
                    "position": 1,
                    "prompt_md": "Read a single line of space-separated integers. Filter out all odd numbers, keeping only the even numbers in their original order. Print the resulting even numbers on a single line separated by a space. (If no even numbers exist, print an empty line).",
                    "starter_code": "numbers = [int(x) for x in input().split()]\n\n# filter even numbers and print space-separated\n",
                    "test_cases": [
                        {"input": "1 2 3 4 5 6\n", "expected": "2 4 6"},
                        {"input": "10 21 32 43 54\n", "expected": "10 32 54"},
                        {"input": "1 3 5 7\n", "expected": ""},
                    ],
                },
                {
                    "title": "Second Largest Distinct Number",
                    "difficulty": "medium",
                    "position": 2,
                    "prompt_md": "Read a single line of space-separated integers. Find and print the **second largest distinct** integer in the list. (You can assume the list contains at least two distinct values).",
                    "starter_code": "numbers = [int(x) for x in input().split()]\n\n# find and print the second largest distinct number\n",
                    "test_cases": [
                        {"input": "5 1 9 3 9 7\n", "expected": "7"},
                        {"input": "10 20 30 40 50\n", "expected": "40"},
                        {"input": "-5 -1 -10 -2\n", "expected": "-2"},
                    ],
                },
                {
                    "title": "Swap Tuple Ends",
                    "difficulty": "easy",
                    "position": 3,
                    "prompt_md": "Read a line of space-separated words and store them in a tuple. Swap the first and last elements, and print the resulting elements separated by a space. If the tuple has fewer than 2 elements, print it as is.",
                    "starter_code": "items = tuple(input().split())\n\n# swap first and last elements and print space-separated\n",
                    "test_cases": [
                        {"input": "apple banana cherry date\n", "expected": "date banana cherry apple"},
                        {"input": "start finish\n", "expected": "finish start"},
                        {"input": "solo\n", "expected": "solo"},
                    ],
                },
            ],
        },
        {
            "slug": "dictionaries-and-sets",
            "title": "Dictionaries & Sets",
            "position": 6,
            "summary": "Key-value mappings, uniqueness, set logic, and lookup speed.",
            "notes_md": DICTIONARIES_AND_SETS_NOTES,
            "exercises": [
                {
                    "title": "Word Frequency Counter",
                    "difficulty": "medium",
                    "position": 1,
                    "prompt_md": "Read a line of lowercase words separated by spaces. Count the frequency of each distinct word using a dictionary. Print each word and its count in alphabetical order of the words, in the format `word: count` (one per line).",
                    "starter_code": "words = input().split()\n\n# count word frequencies and print sorted alphabetically\n",
                    "test_cases": [
                        {"input": "cat dog cat bird dog cat\n", "expected": "bird: 1\ncat: 3\ndog: 2"},
                        {"input": "hello world hello\n", "expected": "hello: 2\nworld: 1"},
                        {"input": "python\n", "expected": "python: 1"},
                    ],
                },
                {
                    "title": "Find Common Elements",
                    "difficulty": "easy",
                    "position": 2,
                    "prompt_md": "Read two lines of space-separated integers. Using sets, find all elements that appear in both lines (set intersection). Print the common numbers in ascending order separated by a space. If there are no common elements, print `none`.",
                    "starter_code": "set1 = set(map(int, input().split()))\nset2 = set(map(int, input().split()))\n\n# find common elements and print in ascending numerical order\n",
                    "test_cases": [
                        {"input": "1 2 3 4 5\n3 4 5 6 7\n", "expected": "3 4 5"},
                        {"input": "10 20 30\n40 50 60\n", "expected": "none"},
                        {"input": "9 1 5\n5 9 1\n", "expected": "1 5 9"},
                    ],
                },
                {
                    "title": "Student Grade Lookup",
                    "difficulty": "easy",
                    "position": 3,
                    "prompt_md": "The first line contains an integer `n` denoting the number of student records. The next `n` lines each contain a student's name and their integer score separated by a space (e.g. `Alice 95`). The final line contains a query name. If the query name exists in the records, print their score. Otherwise, print `Not found`.",
                    "starter_code": "n = int(input())\ngrades = {}\nfor _ in range(n):\n    name, score = input().split()\n    grades[name] = int(score)\n\nquery_name = input()\n# print score or 'Not found'\n",
                    "test_cases": [
                        {"input": "3\nAlice 95\nBob 82\nCharlie 88\nBob\n", "expected": "82"},
                        {"input": "2\nDavid 74\nEva 91\nFrank\n", "expected": "Not found"},
                        {"input": "1\nZoe 100\nZoe\n", "expected": "100"},
                    ],
                },
            ],
        },
    ]

def seed(db: Session) -> None:
    topics_data = get_topics_data()
    
    for t_data in topics_data:
        topic = db.query(Topic).filter(Topic.slug == t_data["slug"]).first()
        if not topic:
            topic = Topic(
                slug=t_data["slug"],
                title=t_data["title"],
                position=t_data["position"],
                summary=t_data["summary"],
                notes_md=t_data["notes_md"],
            )
            db.add(topic)
            db.flush()  # assign topic.id
            
            for ex_data in t_data["exercises"]:
                exercise = Exercise(
                    topic_id=topic.id,
                    title=ex_data["title"],
                    difficulty=ex_data["difficulty"],
                    position=ex_data["position"],
                    prompt_md=ex_data["prompt_md"],
                    starter_code=ex_data["starter_code"],
                    test_cases=ex_data["test_cases"],
                )
                db.add(exercise)
        else:
            # Update metadata if needed
            topic.title = t_data["title"]
            topic.position = t_data["position"]
            topic.summary = t_data["summary"]
            topic.notes_md = t_data["notes_md"]
            
            # Ensure any new exercises in existing topics are added
            existing_ex_titles = {e.title for e in topic.exercises}
            for ex_data in t_data["exercises"]:
                if ex_data["title"] not in existing_ex_titles:
                    exercise = Exercise(
                        topic_id=topic.id,
                        title=ex_data["title"],
                        difficulty=ex_data["difficulty"],
                        position=ex_data["position"],
                        prompt_md=ex_data["prompt_md"],
                        starter_code=ex_data["starter_code"],
                        test_cases=ex_data["test_cases"],
                    )
                    db.add(exercise)

    db.commit()
