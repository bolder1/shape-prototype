// Grade bands for episodes. Plain data with no client-only imports, so server code (the share-card image) can use it too.

export type GradeLetter = 'S' | 'A' | 'B' | 'C' | 'D';

export const GRADES: { min: number; grade: GradeLetter; label: string; colors: [string, string]; tokens: number }[] = [
  { min: 95, grade: 'S', label: 'Masterclass', colors: ['#139E6F', '#3B6FF5'], tokens: 4 },
  { min: 85, grade: 'A', label: 'Sharp', colors: ['#3B6FF5', '#8B5CF6'], tokens: 3 },
  { min: 70, grade: 'B', label: 'Solid', colors: ['#8B5CF6', '#D9467A'], tokens: 2 },
  { min: 50, grade: 'C', label: 'Getting there', colors: ['#1E2A4A', '#8B5CF6'], tokens: 1 },
  { min: 0, grade: 'D', label: 'Keep going', colors: ['#1E2A4A', '#475467'], tokens: 0 },
];

export const gradeFor = (percent: number) => GRADES.find(g => percent >= g.min)!;
export const gradeByLetter = (letter: GradeLetter) => GRADES.find(g => g.grade === letter)!;
