// Metro-map layout for the skill map, computed from the curriculum (no hand placement).
// Rows: the 14 skills, grouped by family. Columns: prerequisite depth, so every chapter sits right of what it builds on.
import { chapterById, chapterDepth, chapters, MAX_DEPTH, type DomainId } from '@shape/engine';
import { FAMILY_ORDER, skillsInFamily, type FamilyId } from '@/lib/skills';

export const NODE_W = 184, NODE_H = 64, COL_W = 224, LANE_H = 84, LABEL_W = 210, FAMILY_GAP = 36, PAD = 32;

export interface MapNode { id: string; domain: DomainId; family: FamilyId; x: number; y: number }
export interface MapRow { domain: DomainId; family: FamilyId; y: number; height: number }
export interface MapFamilyBand { family: FamilyId; y: number; height: number }
export interface MapEdge { from: string; to: string; d: string }

export interface MapLayout { nodes: Record<string, MapNode>; rows: MapRow[]; families: MapFamilyBand[]; edges: MapEdge[]; width: number; height: number }

export function buildLayout(): MapLayout {
  const nodes: Record<string, MapNode> = {};
  const rows: MapRow[] = [];
  const families: MapFamilyBand[] = [];
  let y = PAD;

  for (const family of FAMILY_ORDER) {
    const top = y;
    for (const domain of skillsInFamily(family)) {
      // Two chapters of one skill at the same depth share a column → stack them in lanes.
      const lanes: Record<number, number> = {};
      const inRow = chapters.filter(c => c.domain === domain).sort((a, b) => chapterDepth[a.id] - chapterDepth[b.id]);
      for (const c of inRow) {
        const depth = chapterDepth[c.id];
        const lane = lanes[depth] ?? 0;
        lanes[depth] = lane + 1;
        nodes[c.id] = { id: c.id, domain, family, x: LABEL_W + PAD + depth * COL_W, y: y + lane * LANE_H };
      }
      const height = Math.max(1, ...Object.values(lanes)) * LANE_H;
      rows.push({ domain, family, y, height });
      y += height;
    }
    families.push({ family, y: top, height: y - top });
    y += FAMILY_GAP;
  }

  // Prerequisite lines: from the right edge of the prerequisite to the left edge of the chapter.
  const edges: MapEdge[] = chapters.flatMap(c => c.prereqs.map(p => {
    const a = nodes[p], b = nodes[c.id];
    const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2, x2 = b.x, y2 = b.y + NODE_H / 2;
    const bend = Math.max(40, (x2 - x1) / 2);
    return { from: p, to: c.id, d: `M${x1},${y1} C${x1 + bend},${y1} ${x2 - bend},${y2} ${x2},${y2}` };
  }));

  return { nodes, rows, families, edges, width: LABEL_W + PAD * 2 + (MAX_DEPTH + 1) * COL_W, height: y - FAMILY_GAP + PAD };
}

/** Split a title into at most two lines for SVG (which can't wrap text). */
export function wrapTitle(title: string, max = 25): string[] {
  const words = title.split(' ');
  const lines: string[] = [''];
  for (const w of words) {
    const cur = lines[lines.length - 1];
    if ((cur + ' ' + w).trim().length <= max) lines[lines.length - 1] = (cur + ' ' + w).trim();
    else if (lines.length < 2) lines.push(w);
    else { lines[1] = (lines[1] + ' ' + w).slice(0, max - 1).trimEnd() + '…'; break; }
  }
  return lines;
}

export const exists = (id: string) => !!chapterById[id];
