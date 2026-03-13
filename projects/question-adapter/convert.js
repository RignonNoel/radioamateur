const fs = require("fs");

const inputFile = "amat_basic_quest_delim.txt";
const outputFile = "questions.json";

try {
  // Lecture du fichier en UTF-8
  const content = fs.readFileSync(inputFile, "utf-8");

  // Séparation des lignes et récupération de l'en-tête
  const lines = content.split(/\r?\n/).filter((line) => line.trim() !== "");
  const headers = lines[0].split(";").map((h) => h.trim());

  const jsonResult = lines.slice(1).map((line) => {
    const values = line.split(";");
    let obj = {};
    headers.forEach((header, index) => {
      // Nettoyage des espaces et stockage
      obj[header] = values[index] ? values[index].trim() : "";
    });
    return obj;
  });

  // Écriture du fichier JSON
  fs.writeFileSync(outputFile, JSON.stringify(jsonResult, null, 4), "utf-8");

  console.log(
    `Succès ! ${jsonResult.length} questions converties dans ${outputFile}`,
  );
} catch (error) {
  console.error("Erreur lors de la conversion :", error.message);
}
