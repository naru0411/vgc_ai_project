import fs from "fs";
import { encodePokemon } from "./encode_pokemon.js";

const replay = JSON.parse(fs.readFileSync("replay.json", "utf-8"));
const logLines = replay.log.split("\n");

const teams = { p1: [], p2: [] };

for (const line of logLines) {
  if (line.startsWith("|poke|")) {
    const parts = line.split("|").filter(Boolean);
    const player = parts[1];
    const pokeInfo = parts[2];
    const item = parts[3] || null;
    const ability = parts[4] || null;

    const name = pokeInfo.split(",")[0].trim();

    teams[player].push({
      species: name,
      item,
      ability,
      moves: []
    });
  }

  if (line.startsWith("|move|")) {
    const parts = line.split("|").filter(Boolean);
    const actor = parts[1]; // "p1a: Torkoal"
    const move = parts[2];

    const player = actor.startsWith("p1") ? "p1" : "p2";
    const name = actor.split(":")[1].trim();

    const target = teams[player].find(p => p.species === name);
    if (target && !target.moves.includes(move)) {
      target.moves.push(move);
    }
  }
}

// --- ID化処理 ---
const encodedTeams = {
  p1: teams.p1.map(p => encodePokemon(p)),
  p2: teams.p2.map(p => encodePokemon(p))
};

console.log("✅ ID化されたチーム:");
console.log(JSON.stringify(encodedTeams, null, 2));


