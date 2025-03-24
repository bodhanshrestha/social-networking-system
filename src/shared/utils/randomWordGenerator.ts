export function generateRandomName(wordLength: number) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let name = '';

  for (let i = 0; i < wordLength; i++) {
    const randomIndex = Math.floor(Math.random() * letters.length);
    name += letters[randomIndex];
  }

  return name;
}

export function generateRandomEmail(wordLength: number = 6) {
  const domain = 'gmail.com';
  const randomName = generateRandomName(wordLength);
  return `${randomName}@${domain}`;
}


