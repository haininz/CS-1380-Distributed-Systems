#!/usr/bin/env node

// Extract text from a web page

const {convert} = require('html-to-text');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

// TODO Add some code
let htmlContent = '';

rl.on('line', (line) => {
  // TODO Add some code
  htmlContent += line + '\n';
});

rl.on('close', () => {
  // TODO Add some code
  const text = convert(htmlContent);
  console.log(text);
});
