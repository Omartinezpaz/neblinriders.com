/* eslint-disable no-undef */
const fs = require('fs');
const acorn = require('acorn');
const jsx = require('acorn-jsx');

const Parser = acorn.Parser.extend(jsx());
const file = fs.readFileSync('src/components/Foro/ForoBiker.jsx', 'utf8');

try {
  Parser.parse(file, { sourceType: 'module', ecmaVersion: 2020 });
  console.log('Syntax is OK');
} catch (e) {
  console.error('Syntax Error:', e.message);
}
