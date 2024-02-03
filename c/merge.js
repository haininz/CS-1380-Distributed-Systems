#!/usr/bin/env node

// merge two files---the incoming 1-page index and the global index (on disk)
// the details of the global index can be seen in the test cases.

const fs = require('fs');
const { exit } = require('process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
});

// TODO some code here
class InvertedIndex {
    constructor(count, url) {
        this.count = count;
        this.url = url;
    }
}

let invertedIndexMap = new Map();
const globalIndexPath = process.argv[2];

if (fs.existsSync(globalIndexPath)) {
    const globalIndexContent = fs.readFileSync(globalIndexPath, 'utf8');
    globalIndexContent.split('\n').forEach(line => {
        if (line) {
            let parts = line.split('|').map(part => part.trim());
            let gram = parts[0];
            let indices = parts[1].split(' ').reduce((acc, currentValue, currentIndex, array) => {
                if (currentIndex % 2 === 0) { // Even index: URL
                    let count = parseInt(array[currentIndex + 1], 10);
                    acc.push(new InvertedIndex(count, currentValue));
                }
                return acc;
            }, []);
            invertedIndexMap.set(gram, indices);
        }
    });
}


rl.on('line', (line) => {
    // TODO some code here
    let splitLine = line.split("|");
    let gram = splitLine[0].trim();
    let count = parseInt(splitLine[1].trim(), 10);
    let url = splitLine[2].trim();
    if (invertedIndexMap.has(gram)) {
        invertedIndexMap.get(gram).push(new InvertedIndex(count, url));
    } else {
        invertedIndexMap.set(gram, [new InvertedIndex(count, url)]);
    }
});

rl.on('close', () => {
    mergeIndices();
});

const mergeIndices = () => {
    // TODO some code here
    invertedIndexMap.forEach((values, key) => {
        values.sort((a, b) => b.count - a.count);
        console.log(`${key} |` + values.map(value => ` ${value.url} ${value.count}`).join(''));
    });
}

