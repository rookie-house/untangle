// Lightweight local legal-document analyzer used by the extension's service worker.
// It does NOT call remote APIs. Instead it uses simple heuristics to:
// - produce a short plain-language explanation of the document
// - return an array of "important phrases" to highlight in the page

export type ScrapedData = {
  title: string;
  bodyText: string;
  url?: string;
};

export type AnalysisResult = {
  explanation: string;
  highlights: string[]; // phrases or short snippets to highlight
  confidence?: number; // heuristic confidence 0-100
};

/**
 * analyzeLegalDocument
 * - input: scraped data containing title and bodyText
 * - output: explanation + highlight phrases
 *
 * Implementation notes:
 * - Uses simple heuristics: split into sentences, score by presence of legal keywords
 * - Picks top sentences as explanation building blocks and extracts noun-phrase-like chunks
 * - This keeps everything local and deterministic for the extension runtime
 */
export function analyzeLegalDocument(data: ScrapedData): AnalysisResult {
  const text = (data.bodyText || "").replace(/\s+/g, " ").trim();

  const keywords = [
    "shall",
    "must",
    "liable",
    "warranty",
    "termination",
    "privacy",
    "data",
    "consent",
    "disclaimer",
    "indemn",
    "govern",
    "jurisdiction",
    "limitations",
    "obligat",
    "payment",
    "fees",
    "confidential",
  ];

  // Break into sentences
  const sentences = text
    ? text
        .split(/(?<=[.!?])\s+(?=[A-Z0-9"'\(])/)
        .map(s => s.trim())
        .filter(Boolean)
    : [];

  // Score sentences by keyword matches and length
  const scored = sentences.map(s => {
    const lower = s.toLowerCase();
    const keywordMatches = keywords.reduce((acc, kw) => acc + (lower.includes(kw) ? 1 : 0), 0);
    const score = keywordMatches * 10 + Math.min(20, s.split(' ').length);
    return { s, score };
  });

  // Pick top 3 sentences as the basis for the explanation
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.s);

  // Fallback: if no sentences matched, use the title and first sentence
  if (top.length === 0 && data.title) {
    if (sentences.length) top.push(sentences[0]);
    top.unshift(data.title);
  }

  // Extract short phrases to highlight: pick noun-ish chunks and keyword-containing phrases
  const highlightsSet = new Set<string>();

  // helper: extract phrases by splitting on commas and semicolons and taking 2-6 word windows
  const candidatePhrases: string[] = [];
  sentences.slice(0, 30).forEach(sentence => {
    sentence.split(/[;,\n]/).forEach(part => {
      const words = part.trim().split(/\s+/).filter(Boolean);
      for (let i = 0; i < Math.max(0, words.length - 1); i++) {
        const window = words.slice(i, i + 5).join(' ');
        if (window.length > 12 && window.length < 120) candidatePhrases.push(window);
      }
    });
  });

  // Score candidate phrases by keyword presence and length
  const rankedPhrases = candidatePhrases
    .map(p => ({ p, score: keywords.reduce((acc, kw) => acc + (p.toLowerCase().includes(kw) ? 2 : 0), 0) + Math.min(5, p.split(' ').length) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);

  rankedPhrases.forEach(r => {
    if (r.p.length > 10) {
      // normalize to remove trailing punctuation
      const normalized = r.p.replace(/["'\.;:]+$/g, '').trim();
      highlightsSet.add(normalized);
    }
  });

  // Always include explicit keyword-containing short phrases
  keywords.forEach(kw => {
    const match = text.match(new RegExp(`.{0,40}\\b${kw}\\b.{0,40}`, 'i'));
    if (match) highlightsSet.add(match[0].trim());
  });

  // Limit highlights to top 10
  const highlights = Array.from(highlightsSet).slice(0, 10);

  // Build a short explanation
  const explanation = (top.length
    ? `Summary: ${top.join(' ')}\n\nKey items to note: ${highlights.slice(0, 5).join('; ')}`
    : 'No clear summary could be generated from the scraped content.')
    .trim();

  const confidence = Math.min(100, Math.max(10, rankedPhrases.reduce((a, b) => a + b.score, 0)));

  return {
    explanation,
    highlights,
    confidence,
  };
}

export default analyzeLegalDocument;

