// encode_team.js
const { parseTeamText } = require("./parse_team");
const { encodePokemon } = require("./encode_pokemon");

/**
 * Showdownチームテキストをエンコードされたチームデータに変換
 * @param {string} teamText - Showdownエクスポート形式
 * @returns {Array} - エンコード済みポケモン配列
 */
function encodeTeam(teamText) {
  const team = parseTeamText(teamText);       // [{ species, ability, item, moves }]
  const encodedTeam = team.map(p => encodePokemon(p));
  return encodedTeam;
}

// --- 動作テスト ---
const exampleTeamText = `
Pikachu @ Light Ball
Ability: Static
Level: 50
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Thunderbolt
- Volt Tackle
- Protect
- Fake Out

Charizard @ Charcoal
Ability: Blaze
Level: 50
- Flamethrower
- Air Slash
- Protect
- Solar Beam
`;

console.log("Encoded team:");
console.log(encodeTeam(exampleTeamText));

module.exports = { encodeTeam };
