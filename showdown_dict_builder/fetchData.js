const fetch = require('node-fetch');
const fs = require('fs');
const vm = require('vm');

const baseUrl = 'https://play.pokemonshowdown.com/data/'; // ベースURL
const files = {
  'pokedex.json': 'pokedex.json',
  'moves.json': 'moves.json',
  'abilities.js': 'abilities.json',
  'items.js': 'items.json',
  'typechart.js': 'typechart.json'
};

async function fetchAndSave(url, filename) {
  console.log(`Fetching: ${url}`);
  const res = await fetch(url);
  const text = await res.text();

  let data;
  if (url.endsWith('.js')) {
    const sandbox = { exports: {} }; // exportsを初期化
    vm.createContext(sandbox);
    vm.runInContext(text, sandbox);
    // 必要なデータをsandboxから取得
    data = sandbox.exports || sandbox.Abilities || sandbox.Items || sandbox.TypeChart;
  } else {
    data = JSON.parse(text); // JSONデータの場合は直接解析
  }

  fs.writeFileSync(`data/${filename}`, JSON.stringify(data, null, 2)); // ファイルに保存
  console.log(`Saved: data/${filename}`);
}

async function main() {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data'); // データフォルダを作成
  }
  for (const file in files) {
    await fetchAndSave(baseUrl + file, files[file]); // ファイルを順次処理
  }
}

main().catch(console.error); // エラーハンドリング

