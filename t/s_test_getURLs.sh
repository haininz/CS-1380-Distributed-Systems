#!/bin/bash
T_FOLDER=${T_FOLDER:-t}
R_FOLDER=${R_FOLDER:-}

cd "$(dirname "$0")/..$R_FOLDER" || exit 1

DIFF=${DIFF:-diff}

url="https://abc.com"

if $DIFF <(cat "$T_FOLDER"/d/s4.txt | c/getURLs.js $url | sort) <(sort "$T_FOLDER"/d/s5.txt);
then
    echo "$0 success: URL sets are identical"
else
    echo "$0 failure: URL sets are not identical"
fi
