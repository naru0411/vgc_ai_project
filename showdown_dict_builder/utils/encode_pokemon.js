// encode_pokemon.js
const fs = require('fs');
const path = require('path');

// ---------- helpers ----------
function toId(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}
function warnMissing(kind, name) {
  console.warn(`⚠️ Missing ${kind}: "${name}"`);
  return null;
}
function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf8'));
}

// ---------- load data ----------
const dicts    = loadJSON('dicts.json');      // name→id
const pokedex  = loadJSON('pokedex.json');
const movesDB  = loadJSON('moves.json');
const abilDB   = loadJSON('abilities.json');
const itemsDB  = loadJSON('items.json');
const typesDB  = loadJSON('typechart.json');

// ---------- build robust lookup (名前ゆれに強くする) ----------
function buildLookup(baseMap, dataset) {
  const out = Object.create(null);

  // 1) もともとの name→id
  for (const name in baseMap) {
    const id = baseMap[name];
    out[name] = id;
    out[toId(name)] = id;
  }

  // 2) dataset の id / name もキーに追加（id→id、正規化name→id）
  for (const id in dataset) {
    const entry = dataset[id];
    out[id] = id;                 // すでにIDが渡されたケース
    if (entry && entry.name) {
      out[entry.name] = id;       // 表示名
      out[toId(entry.name)] = id; // 表示名の正規化
    }
  }
  return out;
}

const speciesLookup  = buildLookup(dicts.species_dict || {}, pokedex);
const moveLookup     = buildLookup(dicts.move_dict    || {}, movesDB);
const abilityLookup  = buildLookup(dicts.ability_dict || {}, abilDB);
const itemLookup     = buildLookup(dicts.item_dict    || {}, itemsDB);
const typeLookup     = buildLookup(dicts.type_dict    || {}, typesDB);

function resolve(map, name, kind) {
  if (!name) return warnMissing(kind, name);
  return map[name] ?? map[toId(name)] ?? warnMissing(kind, name);
}

/**
 * ポケモンデータをエンコードしてID配列に変換
 * @param {Object} pokemon - { species, ability, item, moves: string[] }
 * @returns {Object} - { speciesId, typeIds, abilityId, itemId, moveIds }
 */
function encodePokemon(pokemon) {
  // 種族ID（正規化＆リカバリ）
  let speciesId = resolve(speciesLookup, pokemon.species, 'species');
  // もし name→id で取れなくても、toId(species) が pokedex のキーならそれを採用
  if (!speciesId) {
    const guess = toId(pokemon.species);
    if (pokedex[guess]) speciesId = guess;
  }

  // types は pokedex から自動補完
  const speciesEntry = speciesId ? pokedex[speciesId] : null;
  const typeNames = (speciesEntry && speciesEntry.types) ? speciesEntry.types : [];
  const typeIds = typeNames.map(tn => resolve(typeLookup, tn, 'type'));

  // ability / item / moves
  const abilityId = resolve(abilityLookup, pokemon.ability, 'ability');
  const itemId    = resolve(itemLookup,    pokemon.item,    'item');
  const moveIds   = (pokemon.moves || []).map(m => resolve(moveLookup, m, 'move'));

  return { speciesId, typeIds, abilityId, itemId, moveIds };
}

module.exports = { encodePokemon };

// --- 単体テスト（必要なら有効化） ---
// const examplePokemon = {
//   species: "Rotom-Wash",          // フォーム名もOK
//   ability: "Levitate",
//   item: "Leftovers",
//   moves: ["Hydro Pump", "Volt Switch", "Thunderbolt", "Protect"]
// };
// console.log(encodePokemon(examplePokemon));

