export const PIM_TAP_MESSAGES = [
  'Pim is here.',
  'Pim sees you.',
  'Pim is patient.',
  "Pim doesn't judge.",
  'Just dust and time.',
  'Still here.',
  'Pim waits.',
  'One grain at a time.',
];

export function getPimTapMessage(daysSinceLastAction) {
  if (daysSinceLastAction >= 3) return "Pim's been waiting.";
  return PIM_TAP_MESSAGES[Math.floor(Math.random() * PIM_TAP_MESSAGES.length)];
}

export function getDustLevel(daysSinceLastAction) {
  if (daysSinceLastAction < 3) return 0;
  if (daysSinceLastAction < 7) return 1;
  if (daysSinceLastAction < 14) return 2;
  return 3;
}
