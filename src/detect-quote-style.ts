export function detectQuoteStyle(source: string): 'single' | 'double' {
  // Detect quote style used in import statements
  const singleQuoteMatches = source.match(/import.*from\s+'/g) || [];
  const doubleQuoteMatches = source.match(/import.*from\s+"/g) || [];

  // Return the more frequently used style, default is single
  return doubleQuoteMatches.length > singleQuoteMatches.length ? 'double' : 'single';
}
