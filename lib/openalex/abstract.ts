/**
 * Reconstructs the abstract from OpenAlex's abstract_inverted_index format.
 * In OpenAlex, an inverted index is a dictionary where each key is a word/token
 * and the value is an array of integer positions (0-indexed) where the token appears.
 *
 * Example:
 * { "Attention": [0], "is": [1], "all": [2], "you": [3], "need": [4] }
 * -> "Attention is all you need"
 */
export function reconstructInvertedIndex(invertedIndex?: Record<string, number[]> | null): string {
  if (!invertedIndex || typeof invertedIndex !== "object" || Object.keys(invertedIndex).length === 0) {
    return "Abstract unavailable.";
  }

  try {
    const positionWordMap: [number, string][] = [];

    for (const [word, positions] of Object.entries(invertedIndex)) {
      if (Array.isArray(positions)) {
        for (const pos of positions) {
          if (typeof pos === "number" && !isNaN(pos)) {
            positionWordMap.push([pos, word]);
          }
        }
      }
    }

    if (positionWordMap.length === 0) {
      return "Abstract unavailable.";
    }

    // Sort by position ascending
    positionWordMap.sort((a, b) => a[0] - b[0]);

    // Construct the reconstructed text
    const words = positionWordMap.map((item) => item[1]);
    const reconstructed = words.join(" ").trim();

    return reconstructed.length > 0 ? reconstructed : "Abstract unavailable.";
  } catch (err) {
    console.error("Failed to reconstruct OpenAlex abstract inverted index:", err);
    return "Abstract unavailable.";
  }
}
