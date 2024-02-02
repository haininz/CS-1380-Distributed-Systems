#!/bin/bash
#
# Combine terms to create  n-grams (for n=1,2,3) and then count and sort them
while IFS= read -r line; do
    # Unigrams: Output the word itself
    echo "$line"
    
    # Append the current line to a buffer to handle bigrams and trigrams
    buffer+=("$line")

    # Bigrams: If there are at least 2 words in the buffer, output the last 2 as a bigram
    if [ ${#buffer[@]} -ge 2 ]; then
        printf "%s %s\n" "${buffer[-2]}" "${buffer[-1]}"
    fi

    # Trigrams: If there are at least 3 words in the buffer, output the last 3 as a trigram
    if [ ${#buffer[@]} -ge 3 ]; then
        printf "%s %s %s\n" "${buffer[-3]}" "${buffer[-2]}" "${buffer[-1]}"
    fi

    # Keep the buffer size to 3 for trigrams (the last 3 words) by slicing out the leftmost word
    while [ ${#buffer[@]} -gt 3 ]; do
        buffer=("${buffer[@]:1}")
    done
done
