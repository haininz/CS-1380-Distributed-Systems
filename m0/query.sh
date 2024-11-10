#!/bin/bash

# Provided an appropriate index, the query could be implemented using grep
# along  with appropriate stemming of the input strings and stripping of the 
# index metadata

# echo "$@" | cat

GLOBAL_INDEX="d/global-index.txt"
SEARCH_PATTERN="${*// /|}"
grep -Eiw "$SEARCH_PATTERN" "$GLOBAL_INDEX"
