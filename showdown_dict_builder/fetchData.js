import fs from 'fs';
import fetch from 'node-fetch';
import vm from 'vm';

const baseUrl = 'https://play.pokemonshowdown.com/data/';
const files = [
  'pokedex.json',
  'moves.json',
  'abilities.js',
  'items.js',
  'typechart.js'
];

async function fetchAndSaveFile(fileName) {
  const url = baseUrl + fileName;
  console.log(`Fetching: ${url}`);

  const res = await fetch(url);
  const text = await res.text();
  let data;

  if (fileName.endsWith('.json')) {
    data = JSON.parse(text);
  } else if (fileName.endsWith('.js')) {
    // Node.js の VM で exports を評価
    const sandbox = { exports: {} };
    vm.createContext(sandbox);
    vm.runInContext(text, sandbox);
    // exports に入っている最初のオブジェクトを取得
    data = Object.values(sandbox.exports)[0] || sandbox.exports;
  }

  fs.writeFileSync(`data/${fileName.replace('.js', '.json')}`, JSON.stringify(data, null, 2));
  console.log(`Saved: data/${fileName.replace('.js', '.json')}`);
}

(async () => {
  if (!fs.existsSync('data')) fs.mkdirSync('data');
  for (const file of files) {
    await fetchAndSaveFile(file);
  }
})();





