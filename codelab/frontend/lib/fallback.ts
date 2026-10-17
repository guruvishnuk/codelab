import type { TopicDetail, ExerciseDetail } from "./api";

export const FALLBACK_TOPIC_DETAILS: Record<string, TopicDetail> = {
  "python-basics": {
    slug: "python-basics",
    title: "Python basics",
    summary: "Variables, input and output.",
    notes_md: `## Variables and input

A variable is a name that points to a value.

\`\`\`python
name = "Asha"
age = 21
print(name, age)
\`\`\`

Use \`input()\` to read a line of text. It always returns a string, so convert it when you need a number:

\`\`\`python
x = int(input())
print(x * 2)
\`\`\`

## Printing

\`print()\` writes a line to the output. Use an f-string to mix text and values:

\`\`\`python
print(f"Hello, {name}!")
\`\`\`
`,
    exercises: [
      { id: 1, title: "Add two numbers", difficulty: "easy", solved: false },
      { id: 2, title: "Greet someone", difficulty: "easy", solved: false },
    ],
  },
  "control-flow": {
    slug: "control-flow",
    title: "Control flow",
    summary: "Decisions and loops.",
    notes_md: `## if / else

\`\`\`python
n = int(input())
if n % 2 == 0:
    print("even")
else:
    print("odd")
\`\`\`

## for loops

\`range(1, n + 1)\` gives the numbers 1 through n.

\`\`\`python
total = 0
for i in range(1, 6):
    total += i
print(total)  # 15
\`\`\`
`,
    exercises: [
      { id: 3, title: "Even or odd", difficulty: "easy", solved: false },
      { id: 4, title: "Sum up to n", difficulty: "medium", solved: false },
    ],
  },
  "strings": {
    slug: "strings",
    title: "Strings",
    summary: "Slicing, reversing and checking characters.",
    notes_md: `## Indexing and slicing

A string is a sequence of characters. Use square brackets to access individual characters or slices:

\`\`\`python
word = "hello"
print(word[0])    # h
print(word[-1])   # o
print(word[1:4])  # ell
print(word[::-1]) # olleh  (reversed)
\`\`\`

## Useful string methods

\`len(s)\` returns the number of characters. \`.lower()\` converts to lowercase:

\`\`\`python
s = "Hello"
print(len(s))       # 5
print(s.lower())    # hello
\`\`\`
`,
    exercises: [
      { id: 5, title: "Reverse a string", difficulty: "easy", solved: false },
      { id: 6, title: "Count vowels", difficulty: "easy", solved: false },
    ],
  },
  "functions-and-scope": {
    slug: "functions-and-scope",
    title: "Functions & Scope",
    summary: "Reusable blocks, arguments, return values, and variable scope.",
    notes_md: `## Defining Functions

Functions allow you to package reusable logic under a descriptive name using the \`def\` keyword:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`
`,
    exercises: [
      { id: 7, title: "Is palindrome", difficulty: "easy", solved: false },
      { id: 8, title: "Temperature converter", difficulty: "medium", solved: false },
    ],
  },
  "lists-and-tuples": {
    slug: "lists-and-tuples",
    title: "Lists & Tuples",
    summary: "Ordered sequences, mutating, indexing, and immutable tuples.",
    notes_md: `## Lists and Tuples

A list is an ordered, mutable collection of items defined with square brackets \`[]\`:

\`\`\`python
fruits = ["apple", "banana", "cherry"]
fruits.append("date")
print(fruits[0])  # apple
\`\`\`
`,
    exercises: [
      { id: 9, title: "Find maximum", difficulty: "easy", solved: false },
      { id: 10, title: "Filter even numbers", difficulty: "medium", solved: false },
    ],
  },
  "dictionaries-and-sets": {
    slug: "dictionaries-and-sets",
    title: "Dictionaries & Sets",
    summary: "Key-value mappings, unique lookups, and set algebra.",
    notes_md: `## Dictionaries and Sets

Dictionaries store data as key-value pairs using curly braces \`{}\`:

\`\`\`python
student = {"name": "Asha", "score": 95}
print(student["name"])  # Asha
\`\`\`
`,
    exercises: [
      { id: 11, title: "Word frequency", difficulty: "medium", solved: false },
      { id: 12, title: "Unique common elements", difficulty: "medium", solved: false },
    ],
  },
};

export const FALLBACK_EXERCISE_DETAILS: Record<string, ExerciseDetail> = {
  "1": {
    id: 1,
    title: "Add two numbers",
    difficulty: "easy",
    solved: false,
    topic_slug: "python-basics",
    next_exercise_id: 2,
    prompt_md: "Read two integers (one per line) and print their sum.",
    starter_code: "a = int(input())\nb = int(input())\n# print the sum\n",
  },
  "2": {
    id: 2,
    title: "Greet someone",
    difficulty: "easy",
    solved: false,
    topic_slug: "python-basics",
    next_exercise_id: 3,
    prompt_md: "Read a name and print `Hello, <name>!`",
    starter_code: "name = input()\n# print the greeting\n",
  },
  "3": {
    id: 3,
    title: "Even or odd",
    difficulty: "easy",
    solved: false,
    topic_slug: "control-flow",
    next_exercise_id: 4,
    prompt_md: "Read an integer. Print `even` or `odd`.",
    starter_code: "n = int(input())\n# check even or odd\n",
  },
  "4": {
    id: 4,
    title: "Sum up to n",
    difficulty: "medium",
    solved: false,
    topic_slug: "control-flow",
    next_exercise_id: 5,
    prompt_md: "Read `n` and print the sum of 1 + 2 + ... + n.",
    starter_code: "n = int(input())\n# compute sum from 1 to n\n",
  },
  "5": {
    id: 5,
    title: "Reverse a string",
    difficulty: "easy",
    solved: false,
    topic_slug: "strings",
    next_exercise_id: 6,
    prompt_md: "Read a string and print it in reverse order.",
    starter_code: "text = input()\n# print reversed text\n",
  },
  "6": {
    id: 6,
    title: "Count vowels",
    difficulty: "easy",
    solved: false,
    topic_slug: "strings",
    next_exercise_id: 7,
    prompt_md: "Read a string and print the number of vowels (a, e, i, o, u, case-insensitive).",
    starter_code: "text = input()\n# count and print vowels\n",
  },
  "7": {
    id: 7,
    title: "Is palindrome",
    difficulty: "easy",
    solved: false,
    topic_slug: "functions-and-scope",
    next_exercise_id: 8,
    prompt_md: "Read a word and print `True` if it is a palindrome (reads same forward and backward, case-insensitive), else `False`.",
    starter_code: "word = input()\n# check palindrome\n",
  },
  "8": {
    id: 8,
    title: "Temperature converter",
    difficulty: "medium",
    solved: false,
    topic_slug: "functions-and-scope",
    next_exercise_id: 9,
    prompt_md: "Read a Celsius temperature as float and print the Fahrenheit equivalent rounded to 1 decimal place (`(C * 9/5) + 32`).",
    starter_code: "celsius = float(input())\n# convert and print\n",
  },
  "9": {
    id: 9,
    title: "Find maximum",
    difficulty: "easy",
    solved: false,
    topic_slug: "lists-and-tuples",
    next_exercise_id: 10,
    prompt_md: "Read space-separated integers on a single line and print the maximum value.",
    starter_code: "nums = [int(x) for x in input().split()]\n# print max\n",
  },
  "10": {
    id: 10,
    title: "Filter even numbers",
    difficulty: "medium",
    solved: false,
    topic_slug: "lists-and-tuples",
    next_exercise_id: 11,
    prompt_md: "Read space-separated integers and print only the even numbers separated by spaces.",
    starter_code: "nums = [int(x) for x in input().split()]\n# filter and print evens\n",
  },
  "11": {
    id: 11,
    title: "Word frequency",
    difficulty: "medium",
    solved: false,
    topic_slug: "dictionaries-and-sets",
    next_exercise_id: 12,
    prompt_md: "Read a line of text, and print each unique word along with its frequency in order of first appearance, formatted as `word: count`.",
    starter_code: "words = input().split()\n# count and print frequencies\n",
  },
  "12": {
    id: 12,
    title: "Unique common elements",
    difficulty: "medium",
    solved: false,
    topic_slug: "dictionaries-and-sets",
    next_exercise_id: null,
    prompt_md: "Read two lines of space-separated integers. Print the count of unique elements present in both lines.",
    starter_code: "line1 = input().split()\nline2 = input().split()\n# find common elements\n",
  },
};

export function getTopicFallback(slug: string): TopicDetail | null {
  return FALLBACK_TOPIC_DETAILS[slug] || null;
}

export function getExerciseFallback(id: string | number): ExerciseDetail | null {
  return FALLBACK_EXERCISE_DETAILS[String(id)] || null;
}
