function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function formatDisplayName(username: string): string {
  const withoutTrailingDigits = username.replace(/\d+$/, '') || username;

  if (/[-_.]/.test(withoutTrailingDigits)) {
    return withoutTrailingDigits
      .split(/[-_.]/)
      .filter(Boolean)
      .map(capitalize)
      .join(' ');
  }

  const words = withoutTrailingDigits
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(' ')
    .filter(Boolean);

  if (words.length > 1) {
    return words.map(capitalize).join(' ');
  }

  return capitalize(withoutTrailingDigits);
}
