// encode_pokemon.js
const fs = require('fs');
const path = require('path');

// 辞書を読み込み
const dicts = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'dicts.json'), 'utf8'));

/**
 * ポケモンデータをエンコードしてID配列に変換
 * @param {Object} pokemon - { species, types, ability, item, moves }
 * @returns {Object} - { speciesId, typeIds, abilityId, itemId, moveIds }
 */
function encodePokemon(pokemon) {
  return {
    speciesId: dicts.species_dict[pokemon.species] ?? null,
    typeIds: pokemon.types.map(type => dicts.type_dict[type] ?? null),
    abilityId: dicts.ability_dict[pokemon.ability] ?? null,
    itemId: dicts.item_dict[pokemon.item] ?? null,
    moveIds: pokemon.moves.map(move => dicts.move_dict[move] ?? null)
  };
}

// --- 動作テスト ---
const examplePokemon = {
  species: "Pikachu",
  types: ["Electric"],
  ability: "Static",
  item: "Light Ball",
  moves: ["Thunderbolt", "Volt Tackle", "Protect", "Fake Out"]
};

console.log(encodePokemon(examplePokemon));
