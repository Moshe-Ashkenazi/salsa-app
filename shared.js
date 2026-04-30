export const HEB_MONTHS = [
    'ינואר','פברואר','מרץ','אפריל','מאי','יוני',
    'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'
];

export const DEFAULT_SYLLABUS = {
    1: { level: 1, cycleLength: 1, anchorDate: '07/05/26', anchorLesson: 1 },
    2: { level: 2, cycleLength: 1, anchorDate: '07/05/26', anchorLesson: 1 },
    3: { level: 3, cycleLength: 6, anchorDate: '07/05/26', anchorLesson: 1 },
    4: { level: 4, cycleLength: 4, anchorDate: '07/05/26', anchorLesson: 1 },
    5: { level: 5, cycleLength: 4, anchorDate: '07/05/26', anchorLesson: 1 }
};

export function fmtKey(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
}

export function idDate(key) {
    return String(key || '').replace(/[/.]/g, '-');
}

export function parseKeyDate(key) {
    const parts = String(key || '').split(/[/.]/).map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
    const d = new Date(2000 + parts[2], parts[1] - 1, parts[0]);
    if (
        d.getFullYear() !== 2000 + parts[2] ||
        d.getMonth() !== parts[1] - 1 ||
        d.getDate() !== parts[0]
    ) return null;
    return d;
}

export function getThursdays(year, month) {
    const out = [];
    const cur = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    while (cur.getDay() !== 4) cur.setDate(cur.getDate() + 1);
    while (cur <= last) {
        out.push(new Date(cur));
        cur.setDate(cur.getDate() + 7);
    }
    return out;
}

function utcDay(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

export function lessonFor(level, date, syllabusSettings = DEFAULT_SYLLABUS) {
    const setting = syllabusSettings[level] || DEFAULT_SYLLABUS[level];
    const cycleLength = Math.max(1, Number(setting.cycleLength || 1));
    const anchorLesson = Math.min(Math.max(1, Number(setting.anchorLesson || 1)), cycleLength);
    const anchorDate = parseKeyDate(setting.anchorDate) || new Date(date.getFullYear(), date.getMonth(), 1);
    const offset = Math.round((utcDay(date) - utcDay(anchorDate)) / (7 * 24 * 60 * 60 * 1000));
    const lesson = (((anchorLesson - 1 + offset) % cycleLength) + cycleLength) % cycleLength + 1;
    return `${level}.${lesson}`;
}
