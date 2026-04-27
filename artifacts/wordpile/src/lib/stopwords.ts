// Common English stop words. Curated to skip noise without skipping
// nouns/adjectives a practitioner might want to file.
export const STOP_WORDS: ReadonlySet<string> = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
  "any", "are", "aren", "as", "at", "be", "because", "been", "before", "being",
  "below", "between", "both", "but", "by", "can", "cannot", "could", "couldn",
  "did", "didn", "do", "does", "doesn", "doing", "don", "down", "during", "each",
  "few", "for", "from", "further", "had", "hadn", "has", "hasn", "have", "haven",
  "having", "he", "her", "here", "hers", "herself", "him", "himself", "his",
  "how", "i", "if", "in", "into", "is", "isn", "it", "its", "itself", "just",
  "let", "ll", "m", "me", "might", "more", "most", "must", "my", "myself", "no",
  "nor", "not", "now", "o", "of", "off", "on", "once", "only", "or", "other",
  "ought", "our", "ours", "ourselves", "out", "over", "own", "re", "s", "same",
  "shall", "she", "should", "shouldn", "so", "some", "such", "t", "than", "that",
  "the", "their", "theirs", "them", "themselves", "then", "there", "these",
  "they", "this", "those", "through", "to", "too", "under", "until", "up", "ve",
  "very", "was", "wasn", "we", "were", "weren", "what", "when", "where", "which",
  "while", "who", "whom", "why", "will", "with", "won", "would", "wouldn", "y",
  "you", "your", "yours", "yourself", "yourselves",
  // discourse particles & filler
  "yeah", "yes", "ok", "okay", "uh", "um", "er", "ah", "oh", "hey",
  "like", "really", "kind", "sort", "thing", "things", "stuff", "lot",
  "going", "get", "got", "gets", "getting", "go", "goes", "went", "gone",
  "say", "said", "says", "saying", "see", "saw", "seen", "look", "looking",
  "way", "ways", "make", "made", "makes", "making", "take", "took", "taken",
  "give", "gave", "given", "use", "used", "using", "want", "wants", "wanted",
  "know", "knew", "known", "think", "thought", "thinking", "feel", "felt",
  "come", "came", "back", "even", "also", "still", "much", "many",
]);
