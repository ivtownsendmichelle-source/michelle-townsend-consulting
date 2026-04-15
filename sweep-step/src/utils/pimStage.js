const SECTION_COMPLETE_THRESHOLD = 3;

export function calcPimStage(inventories) {
  const sections = ['resentments', 'fears', 'sex', 'harms'];
  const counts = sections.map((s) => inventories[s].length);
  const total = counts.reduce((a, b) => a + b, 0);
  const allSectionsFilled = counts.every((c) => c > 0);
  const anySectionComplete = counts.some((c) => c >= SECTION_COMPLETE_THRESHOLD);

  if (allSectionsFilled && total >= 25) return 4;
  if (total >= 10 || anySectionComplete) return 3;
  if (total > 0) return 2;
  return 1;
}
