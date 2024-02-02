#!/bin/bash
# process text to convert it to maintain one word per 
# line, convert it to lowercase ascii, and remove any stopwords 
# useful commands: tr, iconv, grep

tr -cs A-Za-z '\n' | # TODO replace `cat` more code...
tr 'A-Z' 'a-z' |
iconv -c -t ASCII | 
grep -vxF -f d/stopwords.txt
