#!/bin/bash
# Invert index to create a mapping from terms to URLs containing that term
# The details of the index structure can be seen in the test cases

url="$1"

sort | uniq -c |
while read -r count word; do
    printf "%s | %s | %s\n" "$word" "$count" "$url"
done