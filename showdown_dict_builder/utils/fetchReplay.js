// fetchReplay.js
import fs from "fs";
import fetch from "node-fetch";  // Node.js v18以降なら標準fetchでもOK

const url = "https://replay.pokemonshowdown.com/gen8doublesubers-1097585496.json";
const outputFile = "replay.json";

async function fetchReplay() {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    // 保存
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
    console.log(`✅ Replay saved to ${outputFile}`);
  } catch (err) {
    console.error("❌ Error fetching replay:", err);
  }
}

fetchReplay();
