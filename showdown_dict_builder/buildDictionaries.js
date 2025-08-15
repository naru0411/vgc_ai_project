const fs = require('fs');
const path = require('path');

function loadJSON(file) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
}

function buildSpeciesDict(pokedex) {
  const dict = {};
  for (const id in pokedex) {
    const name = pokedex[id].name;
    dict[name] = id;
  }
  return dict;
}

function buildTypeDict(typechart) {
  const dict = {};
  for (const id in typechart) {
    dict[typechart[id].name] = id;
  }
  return dict;
}

function buildAbilityDict(abilities) {
  const dict = {};
  for (const id in abilities) {
    dict[abilities[id].name] = id;
  }
  return dict;
}

function buildItemDict(items) {
  const dict = {};
  for (const id in items) {
    dict[items[id].name] = id;
  }
  return dict;
}

function buildMoveDict(moves) {
  const dict = {};
  for (const id in moves) {
    dict[moves[id].name] = id;
  }
  return dict;
}

function main() {
  const pokedex = loadJSON('pokedex.json');
  const typechart = loadJSON('typechart.json');
  const abilities = loadJSON('abilities.json');
  const items = loadJSON('items.json');
  const moves = loadJSON('moves.json');

  const species_dict = buildSpeciesDict(pokedex);
  const type_dict = buildTypeDict(typechart);
  const ability_dict = buildAbilityDict(abilities);
  const item_dict = buildItemDict(items);
  const move_dict = buildMoveDict(moves);

  const all_dicts = {
    species_dict,
    type_dict,
    ability_dict,
    item_dict,
    move_dict
  };

  fs.writeFileSync(
    path.join(__dirname, 'data', 'dicts.json'),
    JSON.stringify(all_dicts, null, 2),
    'utf8'
  );

  console.log('✅ 全辞書を data/dicts.json に出力しました');
}

main();

