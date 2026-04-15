export function hashPin(pin) {
  let hash = 0;
  const str = 'sweep-step-salt:' + pin;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(36);
}

export function verifyPin(pin, storedHash) {
  return hashPin(pin) === storedHash;
}
