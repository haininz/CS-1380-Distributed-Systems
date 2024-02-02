#!/bin/bash
# Invert index to create a mapping from terms to URLs containing that term
# The details of the index structure can be seen in the test cases

url="$1" # URL provided as the first script argument

declare -A term_counts # Associative array for term counts

# Read from stdin
while IFS= read -r line; do
    # Trim leading and trailing spaces, and normalize internal spaces to a single space
    clean_line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//;s/[[:space:]]\{1,\}/ /g')
    ((term_counts["$clean_line"]++))
done

# Output the term mapping to URL with counts
for term in "${!term_counts[@]}"; do
    printf "%s | %d | %s\n" "$term" "${term_counts[$term]}" "$url"
done
