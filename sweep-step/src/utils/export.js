/**
 * Export utilities for Sweep Step 4th Step Inventory.
 */

export function generateJSON(store) {
  return JSON.stringify(store, null, 2);
}

function formatToday() {
  const now = new Date();
  return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function joinWithOther(arr, otherValue) {
  const parts = Array.isArray(arr) ? [...arr] : [];
  if (otherValue) parts.push(otherValue);
  return parts.join(', ') || '—';
}

export function generatePlainText(store) {
  const lines = [];

  lines.push('SWEEP STEP — 4th Step Inventory');
  lines.push(`Exported: ${formatToday()}`);
  lines.push('');

  // RESENTMENTS
  lines.push('=== RESENTMENTS ===');
  lines.push('');
  const resentments = store.inventories?.resentments ?? [];
  if (resentments.length === 0) {
    lines.push('(none)');
  } else {
    resentments.forEach((e, i) => {
      lines.push(`${i + 1}. Resentful at: ${e.resentfulAt ?? '—'}`);
      lines.push(`   Cause: ${e.cause ?? '—'}`);
      lines.push(`   Affects: ${joinWithOther(e.affects, e.affects_other)}`);
      lines.push(`   My part: ${joinWithOther(e.myPart, e.myPart_other)}`);
      if (i < resentments.length - 1) lines.push('');
    });
  }
  lines.push('');

  // FEARS
  lines.push('=== FEARS ===');
  lines.push('');
  const fears = store.inventories?.fears ?? [];
  if (fears.length === 0) {
    lines.push('(none)');
  } else {
    fears.forEach((e, i) => {
      lines.push(`${i + 1}. Fear: ${e.fear ?? '—'}`);
      lines.push(`   Why: ${e.why ?? '—'}`);
      lines.push(`   Self-cause: ${e.selfCause ?? '—'}`);
      lines.push(`   Direction: ${e.hpDirection ?? '—'}`);
      if (i < fears.length - 1) lines.push('');
    });
  }
  lines.push('');

  // SEX INVENTORY
  lines.push('=== SEX INVENTORY ===');
  lines.push('');
  const sex = store.inventories?.sex ?? [];
  if (sex.length === 0) {
    lines.push('(none)');
  } else {
    sex.forEach((e, i) => {
      lines.push(`${i + 1}. Whom: ${e.whom ?? '—'}`);
      lines.push(`   What I did: ${e.whatIDid ?? '—'}`);
      lines.push(`   Aroused: ${e.aroused ?? '—'}`);
      lines.push(`   My fault: ${e.myFault ?? '—'}`);
      lines.push(`   Should have done: ${e.shouldHaveDone ?? '—'}`);
      if (i < sex.length - 1) lines.push('');
    });
  }
  lines.push('');

  // HARMS
  lines.push('=== HARMS ===');
  lines.push('');
  const harms = store.inventories?.harms ?? [];
  if (harms.length === 0) {
    lines.push('(none)');
  } else {
    harms.forEach((e, i) => {
      lines.push(`${i + 1}. Person: ${e.person ?? '—'}`);
      lines.push(`   What I did: ${e.whatIDid ?? '—'}`);
      lines.push(`   How affected: ${e.howAffected ?? '—'}`);
      lines.push(`   Amends type: ${e.amendsType ?? '—'}`);
      if (i < harms.length - 1) lines.push('');
    });
  }

  return lines.join('\n');
}

export function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
