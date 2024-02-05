#!/usr/bin/env node

const readline = require('readline');
const {JSDOM} = require('jsdom');
const {URL} = require('url');

// Example usage:
let baseURL = process.argv[2] + '/';

// If the baseURL is a file rather than a directory (e.g. "https://cs.brown.edu/courses/csci1380/sandbox/1/level_1a/index.html/"), then we need to remove the last part of substring ("index.html")
let endWithFile = false;
let secondToLastSlash = -1;
for (i = baseURL.lastIndexOf('/') - 1; i >= 0; i--) {
  if (baseURL[i] == '.') {
    endWithFile = true;
  }
  if (baseURL[i] == '/') {
    secondToLastSlash = i;
    break;
  }
}

if (endWithFile) {
  baseURL = baseURL.substring(0, secondToLastSlash + 1);
}

const rl = readline.createInterface({
  input: process.stdin,
});

// TODO some code
let htmlLines = [];

rl.on('line', (line) => {
  // TODO some code
  htmlLines.push(line);
});

rl.on('close', () => {
  // TODO some code
  const htmlContent = htmlLines.join('\n');

  // Parse the HTML content with JSDOM
  const dom = new JSDOM(htmlContent);

  // Extract all anchor elements
  const anchors = dom.window.document.querySelectorAll('a');

  // Resolve and print out absolute URLs
  anchors.forEach((anchor) => {
    const absoluteURL = new URL(anchor.getAttribute('href'), baseURL).href;
    console.log(absoluteURL);
  });
});
