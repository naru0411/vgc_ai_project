// parse_team.js
const fs = require("fs");

/**
 * Showdownチームテキストをパースして、ポケモンオブジェクトの配列に変換
 * @param {string} teamText - Showdownエクスポート形式の文字列
 * @returns {Array} - [{ species, ability, item, moves }]
 */
function parseTeamText(teamText) {
  const lines = teamText.split("\n");
  const team = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current) {
        team.push(current);
        current = null;
      }
      continue;
    }

    // 新しいポケモン開始行
    if (!current) {
      current = {
        species: null,
        ability: null,
        item: null,
        moves: []
      };
    }

    // 1行目: "Pikachu @ Light Ball"
    if (!current.species) {
      const [speciesPart, itemPart] = trimmed.split("@").map(s => s.trim());
      current.species = speciesPart;
      if (itemPart) current.item = itemPart;
      continue;
    }

    // Ability行
    if (trimmed.startsWith("Ability:")) {
      current.ability = trimmed.replace("Ability:", "").trim();
      continue;
    }

    // 技行
    if (trimmed.startsWith("-")) {
      const move = trimmed.replace("-", "").trim();
      current.moves.push(move);
      continue;
    }
  }

  if (current) team.push(current); // 最後のポケモンを追加
  return team;
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

console.log(parseTeamText(exampleTeamText));

module.exports = { parseTeamText };
