/* =========================================================
   工日记 · Workday Ledger
   Local-first. No network, no accounts, no tracking.
   ========================================================= */
(function () {
  'use strict';

  const APP_VERSION = '1.2.0';
  const DATA_KEY = 'gongriji:data:v1';
  const SNAPSHOT_KEY = 'gongriji:snapshots:v1';
  const PREF_KEY = 'gongriji:prefs:v1';

  const PALETTE = [
    { solid: '#2f8f6b', name: '松绿' },
    { solid: '#4d83b5', name: '雾蓝' },
    { solid: '#c5872c', name: '琥珀' },
    { solid: '#8b6aab', name: '藕紫' },
    { solid: '#c56a5d', name: '陶红' },
    { solid: '#459b96', name: '青瓷' },
    { solid: '#9a7e54', name: '苔褐' },
    { solid: '#778a82', name: '岩灰' }
  ];

  const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const ICONS = {
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v18H6.5A1.5 1.5 0 0 1 5 19.5v-15Z"/><path d="M5 17.5A1.5 1.5 0 0 1 6.5 16H19"/><path d="M9 7h6M9 10.5h4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 9.5h17"/><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.63 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.63h.09A1.7 1.7 0 0 0 10.64 3V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 16.19 4.64a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 20.56 9v.09a1.7 1.7 0 0 0 1.55 1H22a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    x: '<path d="m6 6 12 12M18 6 6 18"/>',
    download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 19.5h16"/>',
    upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M4 4.5h16"/>',
    trash: '<path d="M4 7h16M9 7V4.5h6V7M6.5 7l.8 13h9.4l.8-13"/><path d="M10 11v5M14 11v5"/>',
    edit: '<path d="M4 20h4l11-11a2.12 2.12 0 0 0-3-3L5 17l-1 3Z"/><path d="m14.5 6.5 3 3"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.8M18 14a5 5 0 0 1 3 4.6"/>',
    pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/>',
    more: '<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
    share: '<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4"/>',
    shield: '<path d="M12 3 5 6v5c0 4.7 3.1 8.2 7 10 3.9-1.8 7-5.3 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M10.5 5h3M11 18.5h2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"/>',
    monitor: '<rect x="3" y="4" width="18" height="12.5" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    arrowDown: '<path d="M12 5v14M18 13l-6 6-6-6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    sparkle: '<path d="m12 3 1.7 4.6L18.5 9l-4.8 1.4L12 15l-1.7-4.6L5.5 9l4.8-1.4L12 3Z"/><path d="m19 15 .7 1.8L21.5 17.5l-1.8.7L19 20l-.7-1.8-1.8-.7 1.8-.7L19 15Z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    rotate: '<path d="M20 7v5h-5"/><path d="M19 12a7 7 0 1 1-1.5-4.3L20 10"/>',
    wifiOff: '<path d="m3 3 18 18"/><path d="M8.5 15.5a5 5 0 0 1 7 0M5 12a10 10 0 0 1 3.2-2M19 12a10 10 0 0 0-2.3-1.6M2 8.8A15 15 0 0 1 6.5 6M22 8.8a15 15 0 0 0-10.2-3.6"/><path d="M12 19h.01"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17.5h.01"/>',
    folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h4l2 2.5h7A2.5 2.5 0 0 1 21 10v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17V7.5Z"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.2"/>',
    trend: '<path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/>'
  };

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function icon(name, cls) {
    const body = ICONS[name] || '';
    return `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function pad2(n) { return String(n).padStart(2, '0'); }
  function isoOf(d) { return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; }
  function todayISO() { return isoOf(new Date()); }

  function parseISO(iso) {
    const parts = String(iso || '').split('-').map(Number);
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
    const d = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
    if (d.getFullYear() !== parts[0] || d.getMonth() !== parts[1] - 1 || d.getDate() !== parts[2]) return null;
    return d;
  }
  function isValidISO(iso) { return !!parseISO(iso); }
  function addDays(iso, n) {
    const d = parseISO(iso) || new Date();
    d.setDate(d.getDate() + n);
    return isoOf(d);
  }
  function addMonths(month, n) {
    const [y, m] = String(month).split('-').map(Number);
    const d = new Date(y, m - 1 + n, 1, 12);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
  }
  function monthOf(iso) { return String(iso).slice(0, 7); }
  function currentMonth() { return todayISO().slice(0, 7); }
  function daysInMonth(month) {
    const [y, m] = month.split('-').map(Number);
    return new Date(y, m, 0, 12).getDate();
  }
  function monthLabel(month) {
    const [y, m] = month.split('-').map(Number);
    return `${y}年${m}月`;
  }
  function shortMonthLabel(month) {
    const [, m] = month.split('-').map(Number);
    return `${m}月`;
  }
  function dateLabel(iso) {
    const d = parseISO(iso);
    return d ? `${d.getMonth() + 1}月${d.getDate()}日` : iso;
  }
  function fullDateLabel(iso) {
    const d = parseISO(iso);
    return d ? `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日` : iso;
  }
  function weekdayLabel(iso) {
    const d = parseISO(iso);
    return d ? WEEKDAYS[d.getDay()] : '';
  }
  function shortDate(iso) {
    const d = parseISO(iso);
    return d ? `${d.getMonth() + 1}/${d.getDate()}` : iso;
  }
  function relativeDay(iso) {
    const today = todayISO();
    if (iso === today) return '今天';
    if (iso === addDays(today, -1)) return '昨天';
    if (iso === addDays(today, -2)) return '前天';
    return weekdayLabel(iso);
  }
  function formatTime(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }
  function formatClock(isoString) {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  }

  function uid(prefix) {
    const rand = (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
      : Math.random().toString(36).slice(2, 12);
    return `${prefix || 'x'}_${rand}`;
  }

  function cleanName(value, max) {
    const s = String(value == null ? '' : value)
      .replace(/[\u3000\t\r\n]+/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return Array.from(s).slice(0, max || 20).join('');
  }

  function parseWorkerNames(text) {
    return String(text || '')
      .split(/[\s,，、;；/]+/)
      .map((s) => cleanName(s, 20))
      .filter(Boolean);
  }
  function parseLocationNames(text) {
    return String(text || '')
      .split(/[\n,，、;；/]+/)
      .map((s) => cleanName(s, 30))
      .filter(Boolean);
  }

  function uniqueNames(names) {
    const seen = new Set();
    const out = [];
    for (const name of names) {
      const key = name.toLocaleLowerCase('zh-CN');
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(name);
    }
    return out;
  }

  function colorOf(item) {
    const index = Number(item && item.color);
    return PALETTE[Number.isFinite(index) ? ((index % PALETTE.length) + PALETTE.length) % PALETTE.length : 0];
  }

  function initials(name) {
    const s = String(name || '?').trim();
    return s ? (Array.from(s)[0] || '?') : '?';
  }

  function avatarHTML(entity, extraClass) {
    const color = colorOf(entity);
    return `<span class="avatar${extraClass ? ' ' + extraClass : ''}" style="--p:${color.solid}" aria-hidden="true">${esc(initials(entity && entity.name))}</span>`;
  }

  function dotHTML(entity) {
    return `<span class="loc-dot" style="background:${colorOf(entity).solid}" aria-hidden="true"></span>`;
  }

  function vibrate(ms) {
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (_) { /* ignore */ }
  }

  function deepClone(value) {
    if (value == null) return value;
    if (window.structuredClone) {
      try { return structuredClone(value); } catch (_) { /* fall through */ }
    }
    return JSON.parse(JSON.stringify(value));
  }

  /* ---------------- Preferences ---------------- */
  let prefs = { theme: 'auto', installDismissed: false, backupSnoozedUntil: 0 };

  function loadPrefs() {
    try {
      const raw = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
      if (raw && typeof raw === 'object') prefs = Object.assign(prefs, raw);
    } catch (_) { /* ignore */ }
    if (!['auto', 'light', 'dark'].includes(prefs.theme)) prefs.theme = 'auto';
  }
  function savePrefs() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); } catch (_) { /* ignore */ }
  }
  function applyTheme() {
    document.documentElement.dataset.theme = prefs.theme;
  }

  /* ---------------- Data ---------------- */
  let db = blankDB();
  let storageOK = true;
  let storageWarned = false;
  let loadFailed = false;

  function blankDB() {
    const now = new Date().toISOString();
    return {
      app: 'gongriji',
      version: 1,
      createdAt: now,
      updatedAt: now,
      onboarded: false,
      workers: [],
      locations: [],
      entries: [],
      settings: {
        theme: 'auto',
        lastBackupAt: null,
        lastLocationId: null
      }
    };
  }

  function testStorage() {
    try {
      const key = '__gongriji_test__';
      localStorage.setItem(key, '1');
      localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  function normalizeEntity(raw, prefix, maxName) {
    if (!raw || typeof raw !== 'object') return null;
    const name = cleanName(raw.name, maxName);
    if (!name) return null;
    let color = Number(raw.color);
    if (!Number.isFinite(color)) color = 0;
    color = ((Math.trunc(color) % PALETTE.length) + PALETTE.length) % PALETTE.length;
    return {
      id: typeof raw.id === 'string' && /^[a-z]_[a-zA-Z0-9-]{3,40}$/.test(raw.id) ? raw.id : uid(prefix),
      name,
      color,
      archived: !!raw.archived,
      createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : new Date().toISOString()
    };
  }

  function normalizeDB(raw) {
    if (!raw || typeof raw !== 'object') return null;
    if (raw.data && typeof raw.data === 'object' && Array.isArray(raw.data.entries)) raw = raw.data;

    const out = blankDB();
    out.createdAt = typeof raw.createdAt === 'string' ? raw.createdAt : out.createdAt;
    out.updatedAt = typeof raw.updatedAt === 'string' ? raw.updatedAt : out.updatedAt;
    out.onboarded = !!raw.onboarded;

    const workerIdMap = new Map();
    const usedWorkerNames = new Map();
    const usedWorkerIds = new Set();
    const workers = [];
    for (const item of (Array.isArray(raw.workers) ? raw.workers : [])) {
      const entity = normalizeEntity(item, 'w', 20);
      if (!entity) continue;
      const nameKey = entity.name.toLocaleLowerCase('zh-CN');
      if (usedWorkerNames.has(nameKey)) {
        workerIdMap.set(item && item.id, usedWorkerNames.get(nameKey));
        continue;
      }
      if (usedWorkerIds.has(entity.id)) entity.id = uid('w');
      usedWorkerIds.add(entity.id);
      usedWorkerNames.set(nameKey, entity.id);
      if (item && item.id) workerIdMap.set(item.id, entity.id);
      workers.push(entity);
    }
    out.workers = workers;

    const locationIdMap = new Map();
    const usedLocationNames = new Map();
    const usedLocationIds = new Set();
    const locations = [];
    for (const item of (Array.isArray(raw.locations) ? raw.locations : [])) {
      const entity = normalizeEntity(item, 'l', 30);
      if (!entity) continue;
      const nameKey = entity.name.toLocaleLowerCase('zh-CN');
      if (usedLocationNames.has(nameKey)) {
        locationIdMap.set(item && item.id, usedLocationNames.get(nameKey));
        continue;
      }
      if (usedLocationIds.has(entity.id)) entity.id = uid('l');
      usedLocationIds.add(entity.id);
      usedLocationNames.set(nameKey, entity.id);
      if (item && item.id) locationIdMap.set(item.id, entity.id);
      locations.push(entity);
    }
    out.locations = locations;

    const workerIds = new Set(out.workers.map((w) => w.id));
    const locationIds = new Set(out.locations.map((l) => l.id));
    const entryMap = new Map();
    const usedEntryIds = new Set();

    for (const item of (Array.isArray(raw.entries) ? raw.entries : [])) {
      if (!item || typeof item !== 'object') continue;
      if (!isValidISO(item.date)) continue;
      const locationId = locationIdMap.get(item.locationId) || item.locationId;
      if (!locationIds.has(locationId)) continue;
      const ids = [];
      for (const wid of (Array.isArray(item.workerIds) ? item.workerIds : [])) {
        const mapped = workerIdMap.get(wid) || wid;
        if (workerIds.has(mapped) && !ids.includes(mapped)) ids.push(mapped);
      }
      if (!ids.length) continue;
      const halfIds = [];
      for (const wid of (Array.isArray(item.halfDayWorkerIds) ? item.halfDayWorkerIds : [])) {
        const mapped = workerIdMap.get(wid) || wid;
        if (ids.includes(mapped) && !halfIds.includes(mapped)) halfIds.push(mapped);
      }
      let id = typeof item.id === 'string' && /^e_[a-zA-Z0-9-]{3,40}$/.test(item.id) ? item.id : uid('e');
      if (usedEntryIds.has(id)) id = uid('e');
      usedEntryIds.add(id);
      const entry = {
        id,
        date: item.date,
        locationId,
        workerIds: ids,
        halfDayWorkerIds: halfIds,
        note: String(item.note == null ? '' : item.note).replace(/\r\n?/g, '\n').trim().slice(0, 200),
        createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
        updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : new Date().toISOString()
      };
      const key = `${entry.date}|${entry.locationId}`;
      const prior = entryMap.get(key);
      if (prior) {
        for (const wid of entry.workerIds) if (!prior.workerIds.includes(wid)) prior.workerIds.push(wid);
        for (const wid of entry.halfDayWorkerIds) if (!prior.halfDayWorkerIds.includes(wid)) prior.halfDayWorkerIds.push(wid);
        if (!prior.note && entry.note) prior.note = entry.note;
        if (String(entry.updatedAt) > String(prior.updatedAt)) prior.updatedAt = entry.updatedAt;
      } else {
        entryMap.set(key, entry);
      }
    }
    out.entries = Array.from(entryMap.values());

    if (raw.settings && typeof raw.settings === 'object') {
      out.settings.lastBackupAt = typeof raw.settings.lastBackupAt === 'string' ? raw.settings.lastBackupAt : null;
      const lastLoc = locationIdMap.get(raw.settings.lastLocationId) || raw.settings.lastLocationId;
      out.settings.lastLocationId = locationIds.has(lastLoc) ? lastLoc : null;
    }

    const hasContent = out.workers.length || out.locations.length || out.entries.length;
    out.onboarded = out.onboarded || !!hasContent || raw.onboarded === true;
    if (!out.onboarded && !hasContent) return out;
    return out;
  }

  function loadDB() {
    storageOK = testStorage();
    let rawText = null;
    try { rawText = localStorage.getItem(DATA_KEY); } catch (_) { storageOK = false; }
    if (!rawText) {
      db = blankDB();
      return;
    }
    try {
      const parsed = JSON.parse(rawText);
      const normalized = normalizeDB(parsed);
      if (!normalized) throw new Error('bad data');
      db = normalized;
    } catch (err) {
      loadFailed = true;
      db = blankDB();
    }
  }

  function saveDB(options) {
    db.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(db));
      storageOK = true;
    } catch (err) {
      storageOK = false;
      if (!storageWarned) {
        storageWarned = true;
        toast('浏览器存储空间不足，请先导出备份并清理旧数据', { duration: 7000 });
      }
    }
    if (!options || !options.noEvent) {
      document.dispatchEvent(new CustomEvent('gongriji:datachange'));
    }
  }

  function hasContent(data) {
    return !!(data && data.entries && data.entries.length);
  }

  function getSnapshots() {
    try {
      const list = JSON.parse(localStorage.getItem(SNAPSHOT_KEY) || '[]');
      return Array.isArray(list) ? list.filter((s) => s && s.data && s.at) : [];
    } catch (_) { return []; }
  }

  function snapshotDaily() {
    if (!hasContent(db)) return;
    try {
      const day = todayISO();
      const list = getSnapshots();
      if (list.some((s) => s.day === day)) return;
      list.unshift({ at: new Date().toISOString(), day, data: deepClone(db) });
      while (list.length > 4) list.pop();
      localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(list));
    } catch (_) { /* snapshots are best-effort */ }
  }

  function findWorker(id) { return db.workers.find((w) => w.id === id) || null; }
  function findLocation(id) { return db.locations.find((l) => l.id === id) || null; }
  function findEntry(id) { return db.entries.find((e) => e.id === id) || null; }
  function entryFor(date, locationId) {
    return db.entries.find((e) => e.date === date && e.locationId === locationId) || null;
  }

  function entryHalfIds(entry) {
    if (!entry || !Array.isArray(entry.halfDayWorkerIds)) return [];
    return entry.halfDayWorkerIds.filter((id, index, list) => entry.workerIds.includes(id) && list.indexOf(id) === index);
  }

  function workerDayValue(entry, workerId) {
    return entryHalfIds(entry).includes(workerId) ? 0.5 : 1;
  }

  function entryDays(entry) {
    if (!entry) return 0;
    return entry.workerIds.reduce((sum, id) => sum + workerDayValue(entry, id), 0);
  }

  function formatDays(value) {
    const n = Math.round(Number(value || 0) * 2) / 2;
    if (!Number.isFinite(n)) return '0';
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  function activeWorkers() { return db.workers.filter((w) => !w.archived); }
  function activeLocations() { return db.locations.filter((l) => !l.archived); }

  function addWorkers(names, options) {
    const opts = options || {};
    const created = [];
    const selected = [];
    for (const rawName of uniqueNames(names)) {
      const name = cleanName(rawName, 20);
      if (!name) continue;
      const existing = db.workers.find((w) => w.name.toLocaleLowerCase('zh-CN') === name.toLocaleLowerCase('zh-CN'));
      if (existing) {
        if (existing.archived && opts.restore !== false) existing.archived = false;
        selected.push(existing.id);
        continue;
      }
      const worker = {
        id: uid('w'),
        name,
        color: db.workers.length % PALETTE.length,
        archived: false,
        createdAt: new Date().toISOString()
      };
      db.workers.push(worker);
      created.push(worker);
      selected.push(worker.id);
    }
    if (created.length || opts.touch) saveDB();
    return { created, selected };
  }

  function addLocations(names, options) {
    const opts = options || {};
    const created = [];
    const selected = [];
    for (const rawName of uniqueNames(names)) {
      const name = cleanName(rawName, 30);
      if (!name) continue;
      const existing = db.locations.find((l) => l.name.toLocaleLowerCase('zh-CN') === name.toLocaleLowerCase('zh-CN'));
      if (existing) {
        if (existing.archived && opts.restore !== false) existing.archived = false;
        selected.push(existing.id);
        continue;
      }
      const location = {
        id: uid('l'),
        name,
        color: db.locations.length % PALETTE.length,
        archived: false,
        createdAt: new Date().toISOString()
      };
      db.locations.push(location);
      created.push(location);
      selected.push(location.id);
    }
    if (created.length || opts.touch) saveDB();
    return { created, selected };
  }

  /* ---------------- UI state ---------------- */
  const state = {
    view: 'record',
    date: todayISO(),
    followToday: true,
    locationId: null,
    selectedWorkers: new Set(),
    halfDayWorkers: new Set(),
    note: '',
    workerSearch: '',
    recordMonth: currentMonth(),
    search: '',
    filterWorkerId: '',
    filterLocationId: '',
    statsMode: 'month',
    statsMonth: currentMonth(),
    statsYear: new Date().getFullYear(),
    scrollTopOnRender: false,
    focusForm: false
  };

  function initFormState() {
    state.date = todayISO();
    state.followToday = true;
    const locations = activeLocations();
    let locationId = db.settings.lastLocationId;
    if (!locationId || !locations.some((l) => l.id === locationId)) {
      locationId = locations[0] ? locations[0].id : null;
    }
    state.locationId = locationId;
    loadFormFromEntry();
    state.workerSearch = '';
  }

  function loadFormFromEntry() {
    const entry = state.locationId ? entryFor(state.date, state.locationId) : null;
    state.selectedWorkers = new Set(entry ? entry.workerIds.filter((id) => !!findWorker(id)) : []);
    state.halfDayWorkers = new Set(entry ? entryHalfIds(entry) : []);
    state.note = entry ? (entry.note || '') : '';
  }

  function currentEntry() {
    if (!state.locationId) return null;
    return entryFor(state.date, state.locationId);
  }

  function selectedWorkerIds() {
    return Array.from(state.selectedWorkers).filter((id) => !!findWorker(id));
  }

  function isDirty() {
    if (!state.locationId) return false;
    const entry = currentEntry();
    const ids = selectedWorkerIds().slice().sort();
    const halfIds = Array.from(state.halfDayWorkers).filter((id) => state.selectedWorkers.has(id)).sort();
    const note = String(state.note || '').trim();
    if (!entry) return ids.length > 0 || halfIds.length > 0 || note.length > 0;
    const saved = entry.workerIds.slice().sort();
    const savedHalf = entryHalfIds(entry).slice().sort();
    return ids.join('|') !== saved.join('|')
      || halfIds.join('|') !== savedHalf.join('|')
      || note !== String(entry.note || '').trim();
  }

  function daySummary(date) {
    const entries = db.entries.filter((e) => e.date === date);
    const workers = new Set();
    for (const e of entries) for (const id of e.workerIds) workers.add(id);
    return {
      entries,
      people: workers.size,
      locations: entries.length,
      days: entries.reduce((sum, e) => sum + entryDays(e), 0)
    };
  }

  /* ---------------- Computations ---------------- */
  function canonicalAssignments(entries) {
    const sorted = entries.slice().sort((a, b) => {
      const d = String(a.date).localeCompare(String(b.date));
      if (d) return d;
      return String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
    });
    const seen = new Set();
    const out = [];
    for (const entry of sorted) {
      for (const workerId of entry.workerIds) {
        const key = `${workerId}|${entry.date}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          workerId,
          date: entry.date,
          locationId: entry.locationId,
          entryId: entry.id,
          value: workerDayValue(entry, workerId)
        });
      }
    }
    return out;
  }

  function computeMonthRaw(month) {
    const entries = db.entries.filter((e) => e.date.startsWith(month));
    const assignments = canonicalAssignments(entries);
    const peopleMap = new Map();
    const locMap = new Map();
    const dayCounts = new Map();

    for (const a of assignments) {
      const worker = findWorker(a.workerId);
      const location = findLocation(a.locationId);
      if (!worker || !location) continue;

      if (!peopleMap.has(a.workerId)) {
        peopleMap.set(a.workerId, { worker, dates: new Map(), locations: new Map() });
      }
      const person = peopleMap.get(a.workerId);
      person.dates.set(a.date, a.value);
      person.locations.set(a.locationId, (person.locations.get(a.locationId) || 0) + a.value);

      if (!locMap.has(a.locationId)) {
        locMap.set(a.locationId, { location, dates: new Set(), workers: new Set(), personDays: 0 });
      }
      const loc = locMap.get(a.locationId);
      loc.dates.add(a.date);
      loc.workers.add(a.workerId);
      loc.personDays += a.value;

      dayCounts.set(a.date, (dayCounts.get(a.date) || 0) + 1);
    }

    const people = Array.from(peopleMap.values()).map((p) => {
      const dates = Array.from(p.dates.entries())
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
      return {
        id: p.worker.id,
        name: p.worker.name,
        worker: p.worker,
        days: dates.reduce((sum, item) => sum + item.value, 0),
        dates,
        locations: Array.from(p.locations.entries())
          .map(([id, count]) => ({ location: findLocation(id), count }))
          .filter((x) => !!x.location)
          .sort((a, b) => b.count - a.count || a.location.name.localeCompare(b.location.name, 'zh-CN'))
      };
    }).sort((a, b) => b.days - a.days || a.name.localeCompare(b.name, 'zh-CN'));

    const locations = Array.from(locMap.values()).map((l) => ({
      id: l.location.id,
      name: l.location.name,
      location: l.location,
      workdays: l.dates.size,
      personDays: l.personDays,
      workerCount: l.workers.size
    })).sort((a, b) => b.personDays - a.personDays || a.name.localeCompare(b.name, 'zh-CN'));

    const workdaySet = new Set(assignments.filter((a) => findWorker(a.workerId) && findLocation(a.locationId)).map((a) => a.date));
    const personDays = people.reduce((sum, p) => sum + p.days, 0);
    return {
      month,
      entries,
      assignments,
      people,
      locations,
      personDays,
      workdays: workdaySet.size,
      activeWorkers: people.length,
      locationCount: locations.length,
      avgPerDay: workdaySet.size ? personDays / workdaySet.size : 0,
      dayCounts,
      maxPersonDays: people.length ? people[0].days : 0
    };
  }

  function computeMonth(month) {
    const current = computeMonthRaw(month);
    const previous = computeMonthRaw(addMonths(month, -1));
    return { ...current, previous };
  }

  function computeYear(year) {
    const months = [];
    for (let m = 1; m <= 12; m += 1) months.push(computeMonthRaw(`${year}-${pad2(m)}`));
    const workerMonths = new Map();
    const allDates = new Set();
    let totalPersonDays = 0;
    let busiestIndex = -1;
    let busiest = 0;

    months.forEach((monthData, index) => {
      totalPersonDays += monthData.personDays;
      for (const date of monthData.dayCounts.keys()) allDates.add(date);
      if (monthData.personDays > busiest) {
        busiest = monthData.personDays;
        busiestIndex = index;
      }
      for (const person of monthData.people) {
        if (!workerMonths.has(person.id)) {
          workerMonths.set(person.id, { worker: person.worker, months: Array(12).fill(0) });
        }
        workerMonths.get(person.id).months[index] = person.days;
      }
    });

    for (const worker of db.workers) {
      if (!worker.archived && !workerMonths.has(worker.id)) {
        workerMonths.set(worker.id, { worker, months: Array(12).fill(0) });
      }
    }

    const workers = Array.from(workerMonths.values()).map((row) => ({
      ...row,
      total: row.months.reduce((sum, n) => sum + n, 0)
    })).sort((a, b) => b.total - a.total || a.worker.name.localeCompare(b.worker.name, 'zh-CN'));

    const monthTotals = months.map((m) => m.personDays);
    return {
      year,
      months,
      workers,
      monthTotals,
      totalPersonDays,
      activeWorkers: workers.filter((w) => w.total > 0).length,
      workdays: allDates.size,
      busiestMonth: busiestIndex >= 0 ? `${year}-${pad2(busiestIndex + 1)}` : null,
      busiestValue: busiest,
      avgPerDay: allDates.size ? totalPersonDays / allDates.size : 0
    };
  }

  function lastCrewFor(locationId, date) {
    const prior = db.entries
      .filter((e) => e.date < date && e.workerIds.length)
      .sort((a, b) => b.date.localeCompare(a.date) || String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
    const sameLocation = prior.find((e) => e.locationId === locationId);
    return sameLocation || prior[0] || null;
  }

  function findWorkerConflicts(workerIds, date, locationId, exceptEntryId) {
    const conflicts = [];
    for (const workerId of workerIds) {
      const entry = db.entries.find((e) => e.date === date
        && e.locationId !== locationId
        && e.id !== exceptEntryId
        && e.workerIds.includes(workerId));
      if (entry) conflicts.push({ workerId, entry });
    }
    return conflicts;
  }

  function allTimeWorkerDays() {
    const out = new Map();
    for (const a of canonicalAssignments(db.entries)) {
      out.set(a.workerId, (out.get(a.workerId) || 0) + a.value);
    }
    return out;
  }

  function referencesFor(kind, id) {
    if (kind === 'worker') {
      return db.entries.filter((e) => e.workerIds.includes(id));
    }
    return db.entries.filter((e) => e.locationId === id);
  }

  /* ---------------- Rendering primitives ---------------- */
  function navHTML() {
    const items = [
      { view: 'record', label: '记工', icon: 'book' },
      { view: 'records', label: '记录', icon: 'list' },
      { view: 'stats', label: '统计', icon: 'chart' },
      { view: 'settings', label: '设置', icon: 'gear' }
    ];
    return `<nav class="bottom-nav" aria-label="主导航">${items.map((item) => `
      <button type="button" class="nav-item${state.view === item.view ? ' active' : ''}" data-action="nav" data-view="${item.view}" aria-current="${state.view === item.view ? 'page' : 'false'}">
        <span class="nav-icon">${icon(item.icon)}</span><span>${item.label}</span>
      </button>`).join('')}</nav>`;
  }

  function topbarHTML() {
    const items = [
      { view: 'record', label: '记工' },
      { view: 'records', label: '记录' },
      { view: 'stats', label: '统计' },
      { view: 'settings', label: '设置' }
    ];
    return `<header class="topbar" id="topbar"><div class="topbar-inner">
      <div class="brand">
        <span class="brand-mark">${icon('book')}</span>
        <span class="brand-text"><span class="brand-name">工日记</span><span class="brand-sub">记工 · 算天数</span></span>
      </div>
      <nav class="desktop-nav" aria-label="主导航">${items.map((item) => `<button type="button" class="${state.view === item.view ? 'active' : ''}" data-action="nav" data-view="${item.view}"${state.view === item.view ? ' aria-current="page"' : ''}>${item.label}</button>`).join('')}</nav>
      <div class="top-actions">
        ${isStandalone() ? '' : `<button type="button" class="icon-btn bordered" data-action="install" aria-label="安装到手机桌面" title="安装到手机桌面">${icon('phone')}</button>`}
      </div>
    </div></header>`;
  }

  function offlineBannerHTML() {
    return `<div id="offline-banner" class="offline-banner${navigator.onLine ? ' hidden' : ''}">
      <div class="banner">${icon('wifiOff')}<div class="grow">现在没有网络。工日记可以离线记工，数据会保存在本机。</div></div>
    </div>`;
  }

  function pageHeadHTML(title, sub, actions) {
    return `<div class="view-head">
      <div><h1>${esc(title)}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>
      ${actions ? `<div class="view-head-actions">${actions}</div>` : ''}
    </div>`;
  }

  function monthSwitchHTML(month, context) {
    const isCurrent = month === currentMonth();
    return `<div class="month-switch">
      <button type="button" data-action="${context}-month-prev" aria-label="上个月">${icon('chevronLeft')}</button>
      <button type="button" class="label" data-action="open-month-picker" data-context="${context}" aria-label="选择月份">
        <span>${esc(monthLabel(month))}</span><small>${isCurrent ? '本月 · 点击换月份' : '点击选择月份'}</small>
      </button>
      <button type="button" data-action="${context}-month-next" aria-label="下个月" ${month >= currentMonth() ? 'disabled style="opacity:.35"' : ''}>${icon('chevronRight')}</button>
    </div>`;
  }

  function yearSwitchHTML(year) {
    return `<div class="month-switch">
      <button type="button" data-action="stats-year-prev" aria-label="上一年">${icon('chevronLeft')}</button>
      <div class="label">${year}年<small>年度汇总</small></div>
      <button type="button" data-action="stats-year-next" aria-label="下一年" ${year >= new Date().getFullYear() ? 'disabled style="opacity:.35"' : ''}>${icon('chevronRight')}</button>
    </div>`;
  }

  function entryMetaText(entry) {
    const days = entryDays(entry);
    return `${entry.workerIds.length}人${days !== entry.workerIds.length ? ` · ${formatDays(days)}工日` : ''}`;
  }

  function entryPeopleHTML(entry) {
    const halfIds = entryHalfIds(entry);
    return `<div class="entry-people">${entry.workerIds.map((id) => {
      const worker = findWorker(id);
      if (!worker) return '';
      const half = halfIds.includes(id);
      return `<span class="person-tag"><span class="mini-avatar" style="--p:${colorOf(worker).solid}">${esc(initials(worker.name))}</span>${esc(worker.name)}${half ? '<span class="half-mark">½</span>' : ''}</span>`;
    }).join('')}</div>`;
  }

  function entryCardHTML(entry, options) {
    const opts = options || {};
    const location = findLocation(entry.locationId);
    if (!location) return '';
    return `<article class="entry-card" data-entry-id="${esc(entry.id)}">
      <div class="entry-head">
        <div class="entry-loc">${dotHTML(location)}<strong>${esc(location.name)}</strong></div>
        <span class="entry-meta">${entryMetaText(entry)}</span>
        <div class="entry-actions">
          <button type="button" class="icon-btn sm" data-action="edit-entry" data-id="${esc(entry.id)}" aria-label="编辑这条记录" title="编辑">${icon('edit')}</button>
          <button type="button" class="icon-btn sm" data-action="delete-entry" data-id="${esc(entry.id)}" aria-label="删除这条记录" title="删除">${icon('trash')}</button>
        </div>
      </div>
      ${entryPeopleHTML(entry)}
      ${entry.note ? `<div class="entry-note">${esc(entry.note)}</div>` : ''}
    </article>`;
  }

  function emptyStateHTML(iconName, title, text, actions) {
    return `<div class="entry-empty">${icon(iconName)}<div>${esc(title)}</div>${text ? `<div class="small" style="margin-top:3px">${esc(text)}</div>` : ''}${actions ? `<div class="setup-actions" style="margin-top:12px">${actions}</div>` : ''}</div>`;
  }

  function setupCard(kind) {
    const isWorker = kind === 'worker';
    return `<div class="card setup-card">
      <div class="setup-icon">${icon(isWorker ? 'users' : 'pin')}</div>
      <h3>先添加${isWorker ? '工作人员' : '工作地点'}</h3>
      <p>${isWorker ? '把常在一起的工友加进来，以后点一下就能勾选。' : '把常去的工地加进来，记工时直接点选。'}</p>
      <div class="setup-actions">
        <button type="button" class="btn btn-primary btn-sm" data-action="${isWorker ? 'add-worker' : 'add-location'}">${icon('plus')}添加${isWorker ? '人员' : '地点'}</button>
      </div>
    </div>`;
  }

  /* ---------------- Record view ---------------- */
  function renderRecordView() {
    const today = todayISO();
    const summary = daySummary(state.date);
    const monthStats = computeMonthRaw(monthOf(state.date));
    const workers = activeWorkers();
    const allLocations = activeLocations();
    const selectedLocation = state.locationId ? findLocation(state.locationId) : null;
    const entry = currentEntry();
    const selected = selectedWorkerIds();
    const selectedDays = selected.reduce((sum, id) => sum + (state.halfDayWorkers.has(id) ? 0.5 : 1), 0);
    const dirty = isDirty();

    const hero = `<section class="date-hero" aria-label="记工日期">
      <div class="hero-top">
        <span class="hero-kicker">记工日期</span>
        <div class="hero-nav">
          <button type="button" data-action="date-prev" aria-label="前一天">${icon('chevronLeft')}</button>
          <button type="button" data-action="date-next" aria-label="后一天" ${state.date >= today ? 'disabled style="opacity:.35"' : ''}>${icon('chevronRight')}</button>
        </div>
      </div>
      <div class="date-display">
        <span class="date-num">${esc(pad2(parseISO(state.date) ? parseISO(state.date).getDate() : 1))}</span>
        <span class="date-side">
          <span class="date-week">${weekdayLabel(state.date)}</span>
          <span class="date-month">${esc(monthLabel(monthOf(state.date)))}</span>
          <span class="date-relative">${state.date === today ? '今天' : relativeDay(state.date)}${state.date > today ? ' · 未来' : ''}</span>
        </span>
        <input type="date" id="date-input" value="${esc(state.date)}" max="${today}" aria-label="选择记工日期" style="position:absolute;left:0;right:0;bottom:50px;height:82px;opacity:0;cursor:pointer;border:0;padding:0">
      </div>
      <div class="hero-aside" aria-label="本月概览">
        <span class="hero-aside-kicker">本月概览</span>
        <span class="hero-aside-value">${formatDays(monthStats.personDays)}<small>工日</small></span>
        <span class="hero-aside-sub">${monthStats.activeWorkers} 人 · ${monthStats.workdays} 天有工</span>
      </div>
      <div class="hero-quick">
        <button type="button" class="${state.date === today ? 'active' : ''}" data-action="date-today">今天</button>
        <button type="button" data-action="date-yesterday">昨天</button>
        <button type="button" data-action="focus-date">选择日期</button>
        <span class="hero-recorded"><span class="dot"></span>${summary.people ? `当天已记 ${summary.people} 人${summary.days !== summary.people ? ` · ${formatDays(summary.days)}工日` : ''}` : '当天还没记录'}</span>
      </div>
    </section>`;

    let locationCard;
    if (!allLocations.length) {
      locationCard = setupCard('location');
    } else {
      const visibleLocations = allLocations.slice();
      if (selectedLocation && selectedLocation.archived && !visibleLocations.some((l) => l.id === selectedLocation.id)) {
        visibleLocations.push(selectedLocation);
      }
      locationCard = `<section class="card form-card" aria-labelledby="location-title">
        <div class="section-head"><h2 id="location-title">工作地点</h2><span class="hint">点选一个</span>
          <div class="actions"><button type="button" class="link-btn" data-action="add-location">${icon('plus')} 新增</button></div>
        </div>
        <div class="chip-row">${visibleLocations.map((location) => `
          <button type="button" class="loc-chip${state.locationId === location.id ? ' selected' : ''}" data-action="location-select" data-id="${esc(location.id)}" aria-pressed="${state.locationId === location.id}" title="${esc(location.name)}">
            ${dotHTML(location)}<span>${esc(location.name)}</span>${state.locationId === location.id ? icon('check', 'check') : ''}
          </button>`).join('')}
          <button type="button" class="add-chip" data-action="add-location">${icon('plus')} 新地点</button>
        </div>
      </section>`;
    }

    let workerCard;
    if (!workers.length && !selected.some((id) => (findWorker(id) || {}).archived)) {
      workerCard = setupCard('worker');
    } else {
      const selectedCount = selected.length;
      const lastCrew = (!entry && selectedCount === 0) ? lastCrewFor(state.locationId, state.date) : null;
      const lastCrewWorkers = lastCrew
        ? lastCrew.workerIds.map((id) => findWorker(id)).filter((w) => w && !w.archived)
        : [];
      const lastCrewLocation = lastCrew ? findLocation(lastCrew.locationId) : null;
      workerCard = `<section class="card form-card" id="worker-card" aria-labelledby="worker-title">
        <div class="section-head"><h2 id="worker-title">工作人员</h2><span class="count-pill" id="worker-count">已选 ${selectedCount} 人</span>
          <div class="actions">
            <button type="button" class="link-btn" data-action="worker-all">全选</button>
            <button type="button" class="link-btn" data-action="worker-none">清空</button>
            <button type="button" class="link-btn" data-action="add-worker">${icon('plus')} 新增</button>
          </div>
        </div>
        ${entry ? `<div class="pill-note" style="margin-bottom:9px">${icon('info')} 这个地点当天已有记录，勾选后保存即可修改</div>` : ''}
        ${lastCrew && lastCrewWorkers.length ? `<div class="reuse-bar">
          <div class="reuse-main"><strong>沿用上次人员</strong><small>${lastCrewLocation && lastCrewLocation.id !== state.locationId ? `${esc(lastCrewLocation.name)} · ` : ''}${esc(lastCrewWorkers.map((w) => w.name).join('、'))} · ${esc(dateLabel(lastCrew.date))}</small></div>
          <button type="button" class="btn btn-soft btn-sm" data-action="reuse-last" data-id="${esc(lastCrew.id)}">带入 ${lastCrewWorkers.length} 人</button>
        </div>` : ''}
        ${workers.length >= 8 ? `<div class="worker-search">${icon('search')}<input id="worker-search" type="text" inputmode="search" enterkeyhint="search" value="${esc(state.workerSearch)}" placeholder="搜索人员" autocomplete="off" aria-label="搜索人员"></div>` : ''}
        <div id="worker-grid">${workerGridHTML()}</div>
        ${dayPartsHTML()}
        <div class="divider"></div>
        <div class="note-wrap">
          <label class="note-label" for="note-input">${icon('edit')} 备注 <span class="muted" style="font-weight:400">选填</span></label>
          <textarea id="note-input" class="note-input" maxlength="200" rows="2" placeholder="例如：上午半天、材料未到、加班……">${esc(state.note)}</textarea>
        </div>
      </section>`;
    }

    const dayEntries = db.entries.filter((e) => e.date === state.date)
      .slice()
      .sort((a, b) => String(a.createdAt || '').localeCompare(String(b.createdAt || '')));

    const daySection = `<section class="day-section" aria-labelledby="day-title">
      <div class="day-section-head">
        <h2 id="day-title">当天记录</h2>
        <span class="count-pill neutral">${dayEntries.length} 条</span>
        <div class="actions" style="margin-left:auto">
          <button type="button" class="link-btn" data-action="nav" data-view="records">查看全部 ${icon('chevronRight')}</button>
        </div>
      </div>
      ${dayEntries.length ? `<div class="entry-list">${dayEntries.map((e) => entryCardHTML(e)).join('')}</div>`
        : emptyStateHTML('calendar', '这一天还没有记录', '选好地点和人员，点下面的保存。', `<button type="button" class="btn btn-soft btn-sm" data-action="nav" data-view="records">去看看这个月的记录</button>`)}
    </section>`;

    const saveDock = (allLocations.length && (workers.length || selected.length))
      ? `<div class="save-dock"><div class="save-inner">
          <div class="save-info">
            <div class="save-title">${dirty ? '<span class="dirty-dot"></span>' : ''}${selectedLocation ? esc(selectedLocation.name) : '还没有选地点'}${selected.length ? ` · ${selected.length}人` : ''}</div>
            <div class="save-sub">${selected.length ? `${entry ? '修改' : '新增'} · ${formatDays(selectedDays)} 工日 · ${esc(dateLabel(state.date))}` : '勾选人员后保存'}</div>
          </div>
          <button type="button" class="btn btn-primary${entry && !dirty ? ' is-saved' : ''}" data-action="save-entry" ${(!selectedLocation || !selected.length || (!dirty && !!entry)) ? 'disabled' : ''}>${entry ? (dirty ? '保存修改' : '已保存') : '保存记录'}</button>
        </div></div>`
      : '';

    return `${hero}
      ${needsBackupNotice() ? `<div class="banner backup-banner">${icon('shield')}<div class="grow"><strong>数据只在本机</strong> · 建议每月备份一次；换手机、清浏览器数据前更需要。</div><button type="button" data-action="snooze-backup">稍后</button><button type="button" data-action="backup-sheet">去备份</button></div>` : ''}
      ${locationCard}
      ${workerCard}
      ${daySection}
      ${saveDock}`;
  }

  function dayPartsHTML() {
    const selected = selectedWorkerIds();
    if (!selected.length) return '';
    const totalDays = selected.reduce((sum, id) => sum + (state.halfDayWorkers.has(id) ? 0.5 : 1), 0);
    return `<div class="day-parts">
      <div class="day-parts-head"><span>工日计算</span><small>默认全天，点名字切换半天</small><b>${formatDays(totalDays)} 工日</b></div>
      <div class="part-chips">${selected.map((id) => {
        const worker = findWorker(id);
        if (!worker) return '';
        const half = state.halfDayWorkers.has(id);
        return `<button type="button" class="part-chip${half ? ' half' : ''}" data-action="toggle-half" data-id="${esc(id)}" aria-pressed="${half}" title="${esc(worker.name)}：${half ? '半天' : '全天'}，点一下切换">
          <span>${esc(worker.name)}</span><b>${half ? '½天' : '1天'}</b>
        </button>`;
      }).join('')}</div>
    </div>`;
  }

  function workerGridHTML() {
    const selected = state.selectedWorkers;
    let list = activeWorkers().slice();
    for (const id of selected) {
      const worker = findWorker(id);
      if (worker && worker.archived && !list.some((w) => w.id === id)) list.push(worker);
    }
    const q = state.workerSearch.trim().toLocaleLowerCase('zh-CN');
    if (q) {
      list = list.filter((w) => selected.has(w.id) || w.name.toLocaleLowerCase('zh-CN').includes(q));
    }
    if (!list.length) {
      return `<div class="entry-empty" style="padding:16px">${icon('search')}<div>没有找到人员</div><div class="small" style="margin-top:3px">换个关键词，或新增人员。</div></div>`;
    }
    return `<div class="worker-grid">${list.map((worker) => {
      const isSelected = selected.has(worker.id);
      return `<button type="button" class="worker-chip${isSelected ? ' selected' : ''}${worker.archived ? ' archived' : ''}" data-action="worker-toggle" data-id="${esc(worker.id)}" aria-pressed="${isSelected}" title="${esc(worker.name)}">
        ${avatarHTML(worker)}
        <span class="worker-name">${esc(worker.name)}</span>
        ${worker.archived ? '<span class="archived-mark">停用</span>' : ''}
        <span class="worker-check">${icon('check')}</span>
      </button>`;
    }).join('')}</div>`;
  }

  /* ---------------- Records view ---------------- */
  function filteredEntries() {
    const q = state.search.trim().toLocaleLowerCase('zh-CN');
    return db.entries.filter((entry) => {
      if (!entry.date.startsWith(state.recordMonth)) return false;
      if (state.filterLocationId && entry.locationId !== state.filterLocationId) return false;
      if (state.filterWorkerId && !entry.workerIds.includes(state.filterWorkerId)) return false;
      if (!q) return true;
      const location = findLocation(entry.locationId);
      if (location && location.name.toLocaleLowerCase('zh-CN').includes(q)) return true;
      if (entry.note && entry.note.toLocaleLowerCase('zh-CN').includes(q)) return true;
      return entry.workerIds.some((id) => {
        const worker = findWorker(id);
        return worker && worker.name.toLocaleLowerCase('zh-CN').includes(q);
      });
    }).sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);
      return String(a.createdAt || '').localeCompare(String(b.createdAt || ''));
    });
  }

  function recordsResultsHTML() {
    const entries = filteredEntries();
    const assignments = canonicalAssignments(entries);
    const counted = state.filterWorkerId ? assignments.filter((a) => a.workerId === state.filterWorkerId) : assignments;
    const days = new Set(counted.map((a) => a.date)).size;
    const personDays = counted.reduce((sum, a) => sum + a.value, 0);
    const people = state.filterWorkerId ? (counted.length ? 1 : 0) : new Set(assignments.map((a) => a.workerId)).size;
    const summary = `<div class="records-summary">
      <strong>${days} 天</strong><span class="sep"></span><strong>${formatDays(personDays)} 个工日</strong><span class="sep"></span><span>${people} 人</span>
      <span style="margin-left:auto">${state.filterWorkerId ? '单人筛选' : state.filterLocationId || state.search ? '筛选结果' : '本月全部'}</span>
    </div>`;

    if (!entries.length) {
      return `${summary}<div class="card">${emptyStateHTML('search', '这个月还没有符合条件的记录', '换个筛选条件，或去记工。', `<button type="button" class="btn btn-primary btn-sm" data-action="nav" data-view="record">${icon('plus')} 去记工</button>`)}</div>`;
    }

    const groups = new Map();
    for (const entry of entries) {
      if (!groups.has(entry.date)) groups.set(entry.date, []);
      groups.get(entry.date).push(entry);
    }
    const today = todayISO();
    const list = Array.from(groups.entries()).sort((a, b) => b[0].localeCompare(a[0])).map(([date, list]) => {
      const peopleCount = new Set(list.flatMap((e) => e.workerIds)).size;
      return `<section class="record-day">
        <div class="record-day-head">
          <span class="record-day-date">${esc(dateLabel(date))}</span>
          <span class="record-day-week">${weekdayLabel(date)}</span>
          ${date === today ? '<span class="today-mark">今天</span>' : ''}
          <span class="record-day-count">${list.length} 个地点 · ${peopleCount} 人</span>
        </div>
        ${list.map((entry) => {
          const location = findLocation(entry.locationId);
          if (!location) return '';
          return `<article class="record-entry">
            <div class="entry-head">
              <div class="entry-loc">${dotHTML(location)}<strong>${esc(location.name)}</strong></div>
              <span class="entry-meta">${entryMetaText(entry)}</span>
              <div class="entry-actions">
                <button type="button" class="icon-btn sm" data-action="edit-entry" data-id="${esc(entry.id)}" aria-label="编辑记录">${icon('edit')}</button>
                <button type="button" class="icon-btn sm" data-action="delete-entry" data-id="${esc(entry.id)}" aria-label="删除记录">${icon('trash')}</button>
              </div>
            </div>
            ${entryPeopleHTML(entry)}
            ${entry.note ? `<div class="entry-note">${esc(entry.note)}</div>` : ''}
          </article>`;
        }).join('')}
      </section>`;
    }).join('');

    return `${summary}<div class="record-days">${list}</div>`;
  }

  function renderRecordsView() {
    const all = db.entries.filter((e) => e.date.startsWith(state.recordMonth));
    const location = state.filterLocationId ? findLocation(state.filterLocationId) : null;
    const worker = state.filterWorkerId ? findWorker(state.filterWorkerId) : null;
    const filterActive = !!(state.filterWorkerId || state.filterLocationId);
    const activeFilterChips = [
      worker ? `<span class="filter-chip">${esc(worker.name)}<button type="button" data-action="clear-worker-filter" aria-label="清除人员筛选">${icon('x')}</button></span>` : '',
      location ? `<span class="filter-chip">${esc(location.name)}<button type="button" data-action="clear-location-filter" aria-label="清除地点筛选">${icon('x')}</button></span>` : ''
    ].join('');

    return `${pageHeadHTML('记录', `${esc(monthLabel(state.recordMonth))} · ${all.length} 条原始记录`, `<button type="button" class="icon-btn bordered" data-action="export" data-scope="records" aria-label="导出记录" title="导出">${icon('download')}</button>`)}
      <div class="records-toolbar">
        ${monthSwitchHTML(state.recordMonth, 'record')}
        <div class="search-row">
          <div class="search-box">${icon('search')}<input id="record-search" type="text" inputmode="search" enterkeyhint="search" value="${esc(state.search)}" placeholder="搜人员、地点或备注" autocomplete="off" aria-label="搜索记录"><button type="button" class="search-clear${state.search ? '' : ' hidden'}" id="search-clear" data-action="clear-search" aria-label="清除搜索">${icon('x')}</button></div>
          <button type="button" class="filter-btn${filterActive ? ' active' : ''}" data-action="open-filter">${icon('filter')} 筛选${filterActive ? ' · 已选' : ''}</button>
        </div>
        ${activeFilterChips ? `<div class="filter-chips">${activeFilterChips}</div>` : ''}
      </div>
      <div id="records-results">${recordsResultsHTML()}</div>`;
  }

  /* ---------------- Stats view ---------------- */
  function deltaHTML(current, previous, label) {
    const diff = Math.round((current - previous) * 2) / 2;
    if (!previous && !current) return `<span class="kpi-delta">${label || '较上月'} 持平</span>`;
    if (diff === 0) return `<span class="kpi-delta">${label || '较上月'} 持平</span>`;
    return `<span class="kpi-delta ${diff > 0 ? 'up' : 'down'}">${icon(diff > 0 ? 'arrowUp' : 'arrowDown')}${label || '较上月'} ${diff > 0 ? '+' : ''}${formatDays(diff)}</span>`;
  }

  function kpiHTML(label, value, unit, extra, accent) {
    const kpiIcon = (label === '总工日' || label === '全年工日') ? 'sparkle'
      : label === '出勤人数' ? 'users'
        : label === '有工天数' ? 'calendar'
          : label === '最忙月份' ? 'trend' : 'pin';
    return `<div class="kpi${accent ? ' accent' : ''}">
      <div class="kpi-label">${icon(kpiIcon)}${esc(label)}</div>
      <div class="kpi-value"><strong>${esc(value)}</strong><span>${esc(unit || '')}</span></div>
      ${extra || ''}
    </div>`;
  }

  function personListHTML(monthData) {
    if (!monthData.people.length) {
      return `<div class="card">${emptyStateHTML('users', '这个月还没有工日', '去记工后，这里会自动按人统计。', `<button type="button" class="btn btn-primary btn-sm" data-action="nav" data-view="record">${icon('plus')} 去记工</button>`)}</div>`;
    }
    const max = Math.max(0.5, monthData.maxPersonDays);
    return `<div class="rank-list">${monthData.people.map((person, index) => `
      <details class="person-row">
        <summary>
          <span class="rank">${index + 1}</span>
          ${avatarHTML(person.worker)}
          <span class="person-main">
            <span class="name-line"><span class="name">${esc(person.name)}</span></span>
            <span class="meter"><i style="width:${Math.max(4, Math.round(person.days / max * 100))}%"></i></span>
          </span>
          <span class="person-days"><strong>${formatDays(person.days)}</strong><span>天</span></span>
          ${icon('chevronDown', 'chev')}
        </summary>
        <div class="person-detail">
          <div class="detail-block"><h4>地点分布</h4><div class="detail-tags">${person.locations.map((item) => `<span class="detail-tag">${dotHTML(item.location)}${esc(item.location.name)} · ${formatDays(item.count)}天</span>`).join('')}</div></div>
          <div class="detail-block"><h4>出勤日期</h4><div class="date-dots">${person.dates.map((item) => `<span class="date-pill${item.value === 0.5 ? ' half' : ''}" title="${esc(fullDateLabel(item.date))} ${weekdayLabel(item.date)} · ${item.value === 0.5 ? '半天' : '全天'}">${esc(shortDate(item.date))}${item.value === 0.5 ? '<i>½</i>' : ''}</span>`).join('')}</div></div>
        </div>
      </details>`).join('')}</div>`;
  }

  function locationListHTML(monthData) {
    if (!monthData.locations.length) {
      return `<div class="card">${emptyStateHTML('pin', '还没有地点工日', '记工后，这里会按地点汇总。', '')}</div>`;
    }
    return `<div class="rank-list">${monthData.locations.map((loc) => `
      <div class="stat-loc-row">
        ${dotHTML(loc.location)}
        <div class="grow"><div class="stat-loc-name">${esc(loc.name)}</div><div class="stat-loc-sub">${loc.workerCount} 人 · ${loc.workdays} 个有工日</div></div>
        <div class="stat-loc-days">${formatDays(loc.personDays)}<span> 工日</span></div>
      </div>`).join('')}</div>`;
  }

  function calendarHTML(monthData) {
    const month = monthData.month;
    const [year, mon] = month.split('-').map(Number);
    const totalDays = daysInMonth(month);
    const first = new Date(year, mon - 1, 1, 12);
    const lead = (first.getDay() + 6) % 7;
    const max = Math.max(1, ...Array.from(monthData.dayCounts.values()));
    const today = todayISO();
    const cells = [];
    for (let i = 0; i < lead; i += 1) cells.push('<div class="cal-cell empty" aria-hidden="true"></div>');
    for (let day = 1; day <= totalDays; day += 1) {
      const date = `${month}-${pad2(day)}`;
      const count = monthData.dayCounts.get(date) || 0;
      const level = count ? Math.max(1, Math.ceil(count / max * 4)) : 0;
      const classes = ['cal-cell', count ? 'has' : '', level ? `heat-${level}` : '', date === today ? 'today' : ''].filter(Boolean).join(' ');
      cells.push(`<button type="button" class="${classes}" data-action="cal-day" data-date="${date}" aria-label="${esc(fullDateLabel(date))}${count ? `，${count}人` : '，没有记录'}"><span class="d">${day}</span><span class="n">${count ? count + '人' : ''}</span></button>`);
    }
    const tail = (7 - ((lead + totalDays) % 7)) % 7;
    for (let i = 0; i < tail; i += 1) cells.push('<div class="cal-cell empty" aria-hidden="true"></div>');
    return `<div class="calendar-card">
      <div class="calendar-head">${['一', '二', '三', '四', '五', '六', '日'].map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="calendar-grid">${cells.join('')}</div>
      <div class="row between" style="margin-top:9px;padding:0 2px"><span class="tiny muted">颜色越深，当天人越多</span><span class="tiny muted">点击日期看详情</span></div>
    </div>`;
  }

  function renderMonthStats(monthData) {
    const delta = deltaHTML(monthData.personDays, monthData.previous.personDays);
    return `<div class="seg" role="tablist" aria-label="统计范围" style="margin:2px 0 10px">
        <button type="button" role="tab" class="active" data-action="stats-mode" data-mode="month" aria-selected="true">月度</button>
        <button type="button" role="tab" data-action="stats-mode" data-mode="year" aria-selected="false">年度</button>
      </div>
      ${monthSwitchHTML(monthData.month, 'stats')}
      <div class="kpi-grid">
        ${kpiHTML('总工日', formatDays(monthData.personDays), '个', delta, true)}
        ${kpiHTML('出勤人数', monthData.activeWorkers, '人', `<span class="kpi-delta">平均每天 ${monthData.avgPerDay.toFixed(1)} 人</span>`)}
        ${kpiHTML('有工天数', monthData.workdays, '天', `<span class="kpi-delta">共 ${daysInMonth(monthData.month)} 天</span>`)}
        ${kpiHTML('涉及地点', monthData.locationCount, '个', `<span class="kpi-delta">${monthData.entries.length} 条记录</span>`)}
      </div>

      <section class="stats-section">
        <div class="stats-section-head"><h2>人员工日</h2><span class="sub">1人1天 = 1个工日</span><span class="right">按天数排序</span></div>
        ${personListHTML(monthData)}
      </section>

      <section class="stats-section">
        <div class="stats-section-head"><h2>地点工日</h2><span class="sub">按地点汇总</span></div>
        ${locationListHTML(monthData)}
      </section>

      <section class="stats-section">
        <div class="stats-section-head"><h2>出勤日历</h2><span class="sub">${esc(monthLabel(monthData.month))}</span></div>
        ${calendarHTML(monthData)}
      </section>`;
  }

  function renderYearStats(yearData) {
    const workers = yearData.workers;
    return `<div class="seg" role="tablist" aria-label="统计范围" style="margin:2px 0 10px">
        <button type="button" role="tab" data-action="stats-mode" data-mode="month" aria-selected="false">月度</button>
        <button type="button" role="tab" class="active" data-action="stats-mode" data-mode="year" aria-selected="true">年度</button>
      </div>
      ${yearSwitchHTML(yearData.year)}
      <div class="kpi-grid">
        ${kpiHTML('全年工日', formatDays(yearData.totalPersonDays), '个', `<span class="kpi-delta">平均每天 ${yearData.avgPerDay.toFixed(1)} 人</span>`, true)}
        ${kpiHTML('出勤人数', yearData.activeWorkers, '人', `<span class="kpi-delta">全年有记录</span>`)}
        ${kpiHTML('有工天数', yearData.workdays, '天', `<span class="kpi-delta">${yearData.year}年</span>`)}
        ${kpiHTML('最忙月份', yearData.busiestMonth ? shortMonthLabel(yearData.busiestMonth) : '—', '', `<span class="kpi-delta">${yearData.busiestValue ? formatDays(yearData.busiestValue) + ' 个工日' : '还没有记录'}</span>`)}
      </div>

      <section class="stats-section">
        <div class="stats-section-head"><h2>每人每月工日</h2><span class="sub">点数字跳到对应月份</span></div>
        <div class="matrix-wrap">
          <table class="matrix">
            <thead><tr><th>人员</th>${Array.from({ length: 12 }, (_, i) => `<th>${i + 1}</th>`).join('')}<th>合计</th></tr></thead>
            <tbody>
              ${workers.length ? workers.map((row) => `<tr>
                <td><span class="name-cell">${avatarHTML(row.worker)}<span>${esc(row.worker.name)}</span></span></td>
                ${row.months.map((days, index) => `<td><button type="button" class="m-cell ${days ? 'has' : 'zero'}" data-action="jump-month" data-month="${yearData.year}-${pad2(index + 1)}" title="${esc(row.worker.name)} ${MONTH_NAMES[index]}：${formatDays(days)}天">${days ? formatDays(days) : '·'}</button></td>`).join('')}
                <td><strong>${formatDays(row.total)}</strong></td>
              </tr>`).join('') : `<tr><td colspan="14" style="padding:22px;color:var(--muted);text-align:center">还没有人员记录</td></tr>`}
              ${workers.length ? `<tr class="total-row"><td>合计</td>${yearData.monthTotals.map((n) => `<td>${n ? formatDays(n) : '·'}</td>`).join('')}<td>${formatDays(yearData.totalPersonDays)}</td></tr>` : ''}
            </tbody>
          </table>
        </div>
      </section>

      <section class="stats-section">
        <div class="stats-section-head"><h2>月度趋势</h2><span class="sub">全年 ${MONTH_NAMES[0]} 到 ${MONTH_NAMES[11]}</span></div>
        <div class="card" style="padding:14px">
          ${monthBarsHTML(yearData)}
        </div>
      </section>`;
  }

  function monthBarsHTML(yearData) {
    const max = Math.max(1, ...yearData.monthTotals);
    return `<div style="display:flex;align-items:flex-end;gap:5px;height:120px">${yearData.monthTotals.map((n, index) => {
      const h = n ? Math.max(6, Math.round(n / max * 92)) : 3;
      return `<button type="button" data-action="jump-month" data-month="${yearData.year}-${pad2(index + 1)}" style="flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:3px;border:0;background:transparent;padding:0" title="${MONTH_NAMES[index]} ${formatDays(n)}个工日">
        <span style="font-size:9px;color:var(--muted);font-variant-numeric:tabular-nums">${n ? formatDays(n) : ''}</span>
        <span style="width:100%;max-width:22px;height:${h}px;border-radius:4px 4px 2px 2px;background:${n ? 'var(--primary)' : 'var(--surface-3)'};opacity:${n ? .9 : 1}"></span>
        <span style="font-size:9px;color:var(--muted)">${index + 1}</span>
      </button>`;
    }).join('')}</div>`;
  }

  function renderStatsView() {
    const monthData = computeMonth(state.statsMonth);
    const yearData = computeYear(state.statsYear);
    const isMonth = state.statsMode === 'month';
    const scope = isMonth ? 'stats-month' : 'stats-year';
    return `${pageHeadHTML('统计', isMonth ? '按人、按地点、按天，一眼看清' : '全年每人每月工日一览', `<button type="button" class="icon-btn bordered" data-action="export" data-scope="${scope}" aria-label="导出统计" title="导出">${icon('download')}</button>`)}
      ${isMonth ? renderMonthStats(monthData) : renderYearStats(yearData)}`;
  }

  /* ---------------- Settings view ---------------- */
  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
      || window.navigator.standalone === true;
  }

  function lastBackupLabel() {
    if (!db.settings.lastBackupAt) return '还没备份';
    const d = new Date(db.settings.lastBackupAt);
    if (isNaN(d.getTime())) return '还没备份';
    if (isoOf(d) === todayISO()) return `今天 ${formatClock(db.settings.lastBackupAt)}`;
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  function needsBackupNotice() {
    if (!db.entries.length) return false;
    if (prefs.backupSnoozedUntil && Date.now() < prefs.backupSnoozedUntil) return false;
    if (db.settings.lastBackupAt) {
      const last = new Date(db.settings.lastBackupAt);
      if (!isNaN(last.getTime()) && Date.now() - last.getTime() < 30 * 86400000) return false;
      return true;
    }
    const firstDate = db.entries.reduce((min, entry) => (!min || entry.date < min ? entry.date : min), '');
    const first = firstDate ? parseISO(firstDate) : null;
    return !!(first && Date.now() - first.getTime() >= 7 * 86400000);
  }

  function themeLabel() {
    return { auto: '跟随系统', light: '浅色', dark: '深色' }[prefs.theme] || '跟随系统';
  }

  function renderSettingsView() {
    const workerCount = activeWorkers().length;
    const archivedWorkers = db.workers.filter((w) => w.archived).length;
    const locationCount = activeLocations().length;
    const archivedLocations = db.locations.filter((l) => l.archived).length;
    const snapshots = getSnapshots();
    const latestSnapshot = snapshots[0];

    return `${pageHeadHTML('设置', '数据只保存在这台手机里', '')}
      <div class="settings-group">
        <div class="settings-group-title">记工设置</div>
        <div class="list-card">
          <button type="button" class="setting-row" data-action="manage-workers">
            <span class="setting-icon primary">${icon('users')}</span>
            <span class="setting-main"><span class="setting-title">人员管理</span><span class="setting-sub">新增、改名、停用${archivedWorkers ? ` · ${archivedWorkers}人已停用` : ''}</span></span>
            <span class="setting-value">${workerCount} 人</span>${icon('chevronRight', 'chev')}
          </button>
          <button type="button" class="setting-row" data-action="manage-locations">
            <span class="setting-icon primary">${icon('pin')}</span>
            <span class="setting-main"><span class="setting-title">地点管理</span><span class="setting-sub">新增、改名、停用${archivedLocations ? ` · ${archivedLocations}个已停用` : ''}</span></span>
            <span class="setting-value">${locationCount} 个</span>${icon('chevronRight', 'chev')}
          </button>
          <div class="setting-row">
            <span class="setting-icon">${icon(prefs.theme === 'dark' ? 'moon' : prefs.theme === 'light' ? 'sun' : 'monitor')}</span>
            <span class="setting-main"><span class="setting-title">外观</span><span class="setting-sub">当前：${themeLabel()}</span></span>
          </div>
          <div class="theme-row">
            ${[{ id: 'auto', label: '跟随系统', icon: 'monitor' }, { id: 'light', label: '浅色', icon: 'sun' }, { id: 'dark', label: '深色', icon: 'moon' }].map((t) => `<button type="button" class="theme-opt${prefs.theme === t.id ? ' active' : ''}" data-action="set-theme" data-theme="${t.id}">${icon(t.icon)}<span>${t.label}</span></button>`).join('')}
          </div>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-title">数据与备份</div>
        <div class="list-card">
          <button type="button" class="setting-row" data-action="backup-sheet">
            <span class="setting-icon accent">${icon('shield')}</span>
            <span class="setting-main"><span class="setting-title">备份与导出</span><span class="setting-sub">JSON 完整备份、Excel 可打开的 CSV 表格</span></span>
            <span class="setting-value">${lastBackupLabel()}</span>${icon('chevronRight', 'chev')}
          </button>
          <button type="button" class="setting-row" data-action="import-trigger">
            <span class="setting-icon">${icon('upload')}</span>
            <span class="setting-main"><span class="setting-title">导入备份</span><span class="setting-sub">从另一台手机或旧备份恢复，可合并或覆盖</span></span>
            ${icon('chevronRight', 'chev')}
          </button>
          <button type="button" class="setting-row" data-action="snapshots">
            <span class="setting-icon">${icon('rotate')}</span>
            <span class="setting-main"><span class="setting-title">自动备份</span><span class="setting-sub">每天第一次修改前留存一份，最多4份</span></span>
            <span class="setting-value">${latestSnapshot ? formatTime(latestSnapshot.at).split(' ')[0] : '暂无'}</span>${icon('chevronRight', 'chev')}
          </button>
        </div>
        <div class="setting-note">${icon('info')} 换手机、清理浏览器数据前，请先导出 JSON 备份。备份文件可以发到微信“文件传输助手”或存进网盘。</div>
      </div>

      <div class="settings-group">
        <div class="settings-group-title">应用</div>
        <div class="list-card">
          <button type="button" class="setting-row" data-action="install">
            <span class="setting-icon primary">${icon('phone')}</span>
            <span class="setting-main"><span class="setting-title">安装到手机桌面</span><span class="setting-sub">${isStandalone() ? '已经安装，可离线打开' : '像 App 一样打开，没网也能记'}</span></span>
            <span class="setting-value">${isStandalone() ? '已安装' : '去安装'}</span>${icon('chevronRight', 'chev')}
          </button>
          <button type="button" class="setting-row" data-action="help">
            <span class="setting-icon">${icon('info')}</span>
            <span class="setting-main"><span class="setting-title">使用说明</span><span class="setting-sub">三步记工、统计怎么看、怎么备份</span></span>
            ${icon('chevronRight', 'chev')}
          </button>
          <button type="button" class="setting-row" data-action="about">
            <span class="setting-icon">${icon('shield')}</span>
            <span class="setting-main"><span class="setting-title">关于与隐私</span><span class="setting-sub">本地存储、版本 ${APP_VERSION}</span></span>
            ${icon('chevronRight', 'chev')}
          </button>
        </div>
      </div>

      <div class="settings-group">
        <div class="settings-group-title">危险操作</div>
        <div class="list-card">
          <button type="button" class="setting-row" data-action="clear-data">
            <span class="setting-icon danger">${icon('trash')}</span>
            <span class="setting-main"><span class="setting-title" style="color:var(--danger)">清空所有数据</span><span class="setting-sub">删除全部人员、地点、记录和自动备份</span></span>
            ${icon('chevronRight', 'chev')}
          </button>
        </div>
      </div>
      <div class="version-line">工日记 ${APP_VERSION} · 本地优先，不上传服务器<br>${db.entries.length} 条记录 · ${db.workers.length} 人 · ${db.locations.length} 个地点</div>`;
  }

  /* ---------------- Onboarding ---------------- */
  function renderOnboarding() {
    return `<div class="onboard-wrap">
      <div class="onboard-card">
        <div class="onboard-logo">${icon('book')}</div>
        <h1>工日记</h1>
        <p class="onboard-lead">记好“谁、哪天、在哪个工地”。点几下就完成，月底自动算每人多少工日。<br>数据只留在你手机里。</p>
        <div class="onboard-form">
          <div class="field">
            <label for="ob-workers">工作人员 <span class="optional">可稍后添加</span></label>
            <textarea id="ob-workers" rows="3" placeholder="张三、李四、王五&#10;一行一个也可以"></textarea>
            <div class="tip">用逗号、顿号、空格或换行分开，之后直接勾选。</div>
          </div>
          <div class="field">
            <label for="ob-locations">工作地点 <span class="optional">可稍后添加</span></label>
            <textarea id="ob-locations" rows="2" placeholder="一号工地&#10;二号工地"></textarea>
            <div class="tip">写你平时叫得顺口的名字就行。</div>
          </div>
        </div>
        <div class="onboard-actions">
          <button type="button" class="btn btn-primary btn-lg" data-action="onboard-start">${icon('check')} 开始记账</button>
        </div>
        <button type="button" class="onboard-skip" data-action="onboard-skip">先跳过，进去再添加</button>
        ${getSnapshots().length ? `<button type="button" class="onboard-skip" data-action="onboard-restore">检测到自动备份，点这里恢复</button>` : ''}
        <div class="onboard-foot">${icon('shield')} 不需要注册，不上传数据<br>建议安装到桌面，并每月导出一次备份</div>
      </div>
    </div>`;
  }

  /* ---------------- Viewport / keyboard ---------------- */
  let viewportRaf = 0;

  function updateViewportMetrics() {
    const vv = window.visualViewport;
    const height = vv ? vv.height : (window.innerHeight || document.documentElement.clientHeight || 0);
    const top = vv ? vv.offsetTop : 0;
    document.documentElement.style.setProperty('--vvh', `${Math.max(120, Math.round(height))}px`);
    document.documentElement.style.setProperty('--vv-top', `${Math.max(0, Math.round(top))}px`);
  }

  function scheduleViewportMetrics() {
    if (viewportRaf) return;
    viewportRaf = requestAnimationFrame(() => {
      viewportRaf = 0;
      updateViewportMetrics();
    });
  }

  function ensureFocusedVisible() {
    const active = document.activeElement;
    if (!active || !active.matches('input, textarea, select')) return;
    const modal = $('#modal');
    if (!modal || !modal.open) return;
    const scroller = active.closest('.sheet-body');
    if (!scroller) return;
    const activeRect = active.getBoundingClientRect();
    const scrollRect = scroller.getBoundingClientRect();
    if (activeRect.bottom > scrollRect.bottom - 10) {
      scroller.scrollTop += activeRect.bottom - scrollRect.bottom + 18;
    } else if (activeRect.top < scrollRect.top + 10) {
      scroller.scrollTop -= scrollRect.top - activeRect.top + 18;
    }
  }

  function setupViewportMetrics() {
    updateViewportMetrics();
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        scheduleViewportMetrics();
        setTimeout(ensureFocusedVisible, 80);
        setTimeout(ensureFocusedVisible, 260);
      });
      window.visualViewport.addEventListener('scroll', scheduleViewportMetrics);
    }
    window.addEventListener('resize', () => {
      scheduleViewportMetrics();
      setTimeout(ensureFocusedVisible, 120);
    });
    window.addEventListener('orientationchange', () => {
      scheduleViewportMetrics();
      setTimeout(updateViewportMetrics, 300);
    });
    document.addEventListener('focusin', (event) => {
      if (!event.target.matches('input, textarea, select')) return;
      setTimeout(ensureFocusedVisible, 80);
      setTimeout(ensureFocusedVisible, 260);
      setTimeout(ensureFocusedVisible, 520);
    });
  }

  /* ---------------- App render ---------------- */
  function render() {
    applyTheme();
    const app = $('#app');
    if (!app) return;

    if (!db.onboarded) {
      document.body.classList.remove('has-save-dock');
      app.innerHTML = renderOnboarding();
      return;
    }

    let view = '';
    if (state.view === 'record') view = renderRecordView();
    else if (state.view === 'records') view = renderRecordsView();
    else if (state.view === 'stats') view = renderStatsView();
    else view = renderSettingsView();

    app.innerHTML = `${topbarHTML()}
      <main class="app-main" id="main">${offlineBannerHTML()}${view}</main>
      ${navHTML()}`;

    document.body.classList.toggle('has-save-dock', !!$('.save-dock'));
    updateTopbarScroll();
    if (state.scrollTopOnRender) {
      state.scrollTopOnRender = false;
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    if (state.focusForm) {
      state.focusForm = false;
      const el = $('#worker-card');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    resizeNote();
  }

  function updateTopbarScroll() {
    const bar = $('#topbar');
    if (!bar) return;
    bar.classList.toggle('scrolled', window.scrollY > 4);
  }

  function switchView(view) {
    if (!['record', 'records', 'stats', 'settings'].includes(view)) return;
    if (view === state.view) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    clearToasts();
    state.view = view;
    state.scrollTopOnRender = true;
    render();
  }

  function resizeNote() {
    const note = $('#note-input');
    if (!note) return;
    note.style.height = 'auto';
    note.style.height = `${Math.min(120, Math.max(46, note.scrollHeight))}px`;
  }

  /* ---------------- Sheets & toasts ---------------- */
  function showSheet(options) {
    const dlg = $('#modal');
    if (!dlg) return null;
    if (dlg.open) dlg.close();
    dlg.innerHTML = `<div class="sheet" role="document">
      <div class="sheet-head">
        <div><h2>${options.title || ''}</h2>${options.sub ? `<div class="sub">${options.sub}</div>` : ''}</div>
        <button type="button" class="icon-btn" data-sheet-close aria-label="关闭">${icon('x')}</button>
      </div>
      <div class="sheet-body">${options.body || ''}</div>
      ${options.footer ? `<div class="sheet-foot">${options.footer}</div>` : ''}
    </div>`;
    document.body.classList.add('modal-open');
    dlg.setAttribute('aria-label', options.title || '对话框');
    dlg.showModal();

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      try { if (dlg.open) dlg.close(); } catch (_) { /* ignore */ }
      dlg.innerHTML = '';
      document.body.classList.remove('modal-open');
      if (typeof options.onClose === 'function') options.onClose();
    };

    dlg.onclick = (event) => {
      if (event.target === dlg) close();
    };
    dlg.oncancel = (event) => {
      event.preventDefault();
      close();
    };
    dlg.querySelectorAll('[data-sheet-close]').forEach((btn) => {
      btn.addEventListener('click', close);
    });
    if (typeof options.onMount === 'function') options.onMount(dlg, close);
    setTimeout(() => {
      if (!dlg.open) return;
      const auto = dlg.querySelector('[data-autofocus]');
      if (auto && auto.focus && auto.isConnected) auto.focus();
    }, 40);
    return { dlg, close };
  }

  function closeModal() {
    const dlg = $('#modal');
    if (!dlg) return;
    try { if (dlg.open) dlg.close(); } catch (_) { /* ignore */ }
    dlg.innerHTML = '';
    document.body.classList.remove('modal-open');
  }

  function confirmDialog(options) {
    return new Promise((resolve) => {
      let settled = false;
      let closeFn = null;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        if (closeFn) closeFn();
        resolve(value);
      };
      const sheet = showSheet({
        title: options.title || '确认',
        sub: options.sub || '',
        body: `<div class="dialog-message">${options.message || ''}</div>${options.note ? `<div class="dialog-note">${options.note}</div>` : ''}`,
        footer: `<button type="button" class="btn btn-ghost" data-confirm-cancel>${esc(options.cancelText || '取消')}</button>
          <button type="button" class="btn ${options.danger ? 'btn-danger' : 'btn-primary'}" data-confirm-ok>${esc(options.confirmText || '确定')}</button>`,
        onClose: () => finish(false),
        onMount: (dlg, close) => {
          closeFn = close;
          dlg.querySelector('[data-confirm-cancel]').addEventListener('click', () => finish(false));
          dlg.querySelector('[data-confirm-ok]').addEventListener('click', () => finish(true));
          setTimeout(() => dlg.querySelector('[data-confirm-ok]')?.focus(), 50);
        }
      });
      if (sheet) closeFn = sheet.close;
    });
  }

  function clearToasts() {
    const region = $('#toast-region');
    if (!region) return;
    Array.from(region.children).forEach((el) => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 190);
    });
  }

  function toast(message, options) {
    const opts = options || {};
    const region = $('#toast-region');
    if (!region) return;
    while (region.firstElementChild) region.firstElementChild.remove();
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `<span class="toast-text">${esc(message)}</span>`;
    if (opts.actionLabel && typeof opts.onAction === 'function') {
      const action = document.createElement('button');
      action.type = 'button';
      action.textContent = opts.actionLabel;
      action.addEventListener('click', () => {
        dismiss();
        try { opts.onAction(); } catch (_) { /* ignore */ }
      });
      el.appendChild(action);
    }
    let removed = false;
    const dismiss = () => {
      if (removed) return;
      removed = true;
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 190);
    };
    region.appendChild(el);
    const duration = opts.duration || (opts.actionLabel ? 5200 : 2800);
    setTimeout(dismiss, duration);
  }

  /* ---------------- Add / manage dialogs ---------------- */
  function openAddWorkersDialog(options) {
    const opts = options || {};
    showSheet({
      title: '添加工作人员',
      sub: '可以一次添加多个，之后直接勾选。',
      body: `<div class="field">
        <label for="add-worker-names">姓名</label>
        <textarea id="add-worker-names" rows="3" data-autofocus placeholder="张三、李四、王五&#10;一行一个也可以"></textarea>
        <div class="tip">用逗号、顿号、空格或换行分开；重名会自动跳过。</div>
      </div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>取消</button><button type="button" class="btn btn-primary" id="add-worker-submit">${icon('plus')} 添加</button>`,
      onMount: (dlg, close) => {
        const input = dlg.querySelector('#add-worker-names');
        const submit = () => {
          const names = parseWorkerNames(input.value);
          if (!names.length) {
            toast('请先输入姓名');
            input.focus();
            return;
          }
          const result = addWorkers(names);
          if (opts.record) {
            for (const id of result.selected) state.selectedWorkers.add(id);
          }
          saveDB();
          close();
          if (typeof opts.onDone === 'function') opts.onDone(result);
          else {
            render();
            toast(result.created.length ? `已添加 ${result.created.length} 人` : '这些人已经在名单里');
          }
        };
        dlg.querySelector('#add-worker-submit').addEventListener('click', submit);
        input.addEventListener('keydown', (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit();
        });
      }
    });
  }

  function openAddLocationsDialog(options) {
    const opts = options || {};
    showSheet({
      title: '添加工作地点',
      sub: '写平时叫得顺口的名字就行。',
      body: `<div class="field">
        <label for="add-location-names">地点名称</label>
        <textarea id="add-location-names" rows="3" data-autofocus placeholder="一号工地&#10;二号工地"></textarea>
        <div class="tip">可以一次添加多个，一行一个或用逗号分开。</div>
      </div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>取消</button><button type="button" class="btn btn-primary" id="add-location-submit">${icon('plus')} 添加</button>`,
      onMount: (dlg, close) => {
        const input = dlg.querySelector('#add-location-names');
        const submit = () => {
          const names = parseLocationNames(input.value);
          if (!names.length) {
            toast('请先输入地点名称');
            input.focus();
            return;
          }
          const hadNoLocation = !state.locationId;
          const wasDirty = isDirty();
          const pendingWorkers = new Set(state.selectedWorkers);
          const pendingHalf = new Set(state.halfDayWorkers);
          const pendingNote = state.note;
          const result = addLocations(names);
          saveDB();
          close();
          if (typeof opts.onDone === 'function') {
            opts.onDone(result);
          } else {
            if (result.selected.length && (!wasDirty || hadNoLocation)) {
              state.locationId = result.selected[0];
              state.workerSearch = '';
              loadFormFromEntry();
              if (hadNoLocation && !currentEntry() && pendingWorkers.size) {
                state.selectedWorkers = pendingWorkers;
                state.halfDayWorkers = pendingHalf;
                state.note = pendingNote;
              }
            }
            render();
            toast(result.created.length
              ? (wasDirty && !hadNoLocation ? '已添加，保存当前记录后再点选新地点' : `已添加 ${result.created.length} 个地点`)
              : '这个地点已经在列表里');
          }
        };
        dlg.querySelector('#add-location-submit').addEventListener('click', submit);
        input.addEventListener('keydown', (event) => {
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') submit();
        });
      }
    });
  }

  function openManageDialog(kind) {
    const isWorker = kind === 'worker';
    const items = isWorker ? db.workers : db.locations;
    const active = items.filter((x) => !x.archived);
    const archived = items.filter((x) => x.archived);
    const dayMap = isWorker ? allTimeWorkerDays() : null;

    const rowHTML = (item) => {
      const refs = referencesFor(kind, item.id).length;
      const sub = isWorker
        ? `${formatDays(dayMap.get(item.id) || 0)} 个工日${refs ? ` · ${refs} 条记录` : ' · 暂无记录'}`
        : `${refs} 条记录${refs ? '' : ' · 还没用过'}`;
      return `<div class="manage-row${item.archived ? ' archived' : ''}">
        ${avatarHTML(item)}
        <div class="manage-main"><div class="manage-name">${esc(item.name)}</div><div class="manage-sub">${esc(sub)}${item.archived ? ' · 已停用' : ''}</div></div>
        <div class="manage-actions"><button type="button" class="icon-btn sm" data-manage-edit="${esc(item.id)}" aria-label="编辑${esc(item.name)}">${icon('edit')}</button></div>
      </div>`;
    };

    showSheet({
      title: isWorker ? '人员管理' : '地点管理',
      sub: isWorker ? '停用后不会出现在记工勾选里，历史记录保留。' : '停用后不会出现在地点选择里，历史记录保留。',
      body: `<div class="stack gap-12">
        ${active.length ? `<div class="manage-list">${active.map(rowHTML).join('')}</div>` : `<div class="entry-empty" style="padding:20px">${icon(isWorker ? 'users' : 'pin')}<div>还没有${isWorker ? '人员' : '地点'}</div></div>`}
        ${archived.length ? `<div><div class="settings-group-title" style="margin:2px 2px 6px">已停用</div><div class="manage-list">${archived.map(rowHTML).join('')}</div></div>` : ''}
        <div class="setting-note" style="border-radius:9px">${icon('info')} 已经有记录引用的人员/地点不能直接删除，可以停用；历史统计不受影响。</div>
      </div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>完成</button><button type="button" class="btn btn-primary" id="manage-add">${icon('plus')} 添加${isWorker ? '人员' : '地点'}</button>`,
      onMount: (dlg, close) => {
        dlg.querySelectorAll('[data-manage-edit]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-manage-edit');
            close();
            setTimeout(() => openEntityEdit(kind, id, () => openManageDialog(kind)), 30);
          });
        });
        dlg.querySelector('#manage-add').addEventListener('click', () => {
          close();
          setTimeout(() => {
            if (isWorker) openAddWorkersDialog({ onDone: () => openManageDialog(kind) });
            else openAddLocationsDialog({ onDone: () => openManageDialog(kind) });
          }, 30);
        });
      }
    });
  }

  function openEntityEdit(kind, id, onDone) {
    const isWorker = kind === 'worker';
    const item = isWorker ? findWorker(id) : findLocation(id);
    if (!item) return;
    const refs = referencesFor(kind, id);
    const dayMap = isWorker ? allTimeWorkerDays() : null;
    const detail = isWorker
      ? `${formatDays(dayMap.get(id) || 0)} 个工日 · ${refs.length} 条记录`
      : `${refs.length} 条记录`;

    showSheet({
      title: isWorker ? '编辑人员' : '编辑地点',
      sub: detail,
      body: `<div class="field">
          <label for="entity-name">${isWorker ? '姓名' : '地点名称'}</label>
          <input id="entity-name" type="text" maxlength="${isWorker ? 20 : 30}" value="${esc(item.name)}" data-autofocus>
          <div class="tip">改名不会影响已有的历史记录。</div>
        </div>
        <div class="divider"></div>
        <div class="row gap-8 wrap">
          <button type="button" class="btn btn-soft btn-sm" id="entity-toggle">${item.archived ? '恢复使用' : '停用'}</button>
          <button type="button" class="btn btn-danger btn-sm" id="entity-delete" ${refs.length ? 'disabled title="已有记录引用，不能删除"' : ''}>删除</button>
        </div>
        <div class="dialog-note" style="margin-top:10px">${refs.length ? '已有记录引用，不能直接删除；可以停用，历史统计仍然保留。' : '还没有记录引用，可以安全删除。'}</div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>取消</button><button type="button" class="btn btn-primary" id="entity-save">保存</button>`,
      onMount: (dlg, close) => {
        const input = dlg.querySelector('#entity-name');
        const finish = () => {
          close();
          if (typeof onDone === 'function') onDone();
          else render();
        };
        dlg.querySelector('#entity-save').addEventListener('click', () => {
          const name = cleanName(input.value, isWorker ? 20 : 30);
          if (!name) { toast('名称不能为空'); input.focus(); return; }
          const duplicate = (isWorker ? db.workers : db.locations).find((x) => x.id !== id && x.name.toLocaleLowerCase('zh-CN') === name.toLocaleLowerCase('zh-CN'));
          if (duplicate) { toast('这个名字已经存在'); input.focus(); return; }
          item.name = name;
          saveDB();
          finish();
          toast('已保存');
        });
        dlg.querySelector('#entity-toggle').addEventListener('click', () => {
          item.archived = !item.archived;
          if (isWorker) {
            const current = currentEntry();
            if (!current || !current.workerIds.includes(item.id)) {
              state.selectedWorkers.delete(item.id);
              state.halfDayWorkers.delete(item.id);
            }
          } else if (state.locationId === item.id && item.archived) {
            state.locationId = activeLocations()[0]?.id || null;
            loadFormFromEntry();
          }
          saveDB();
          finish();
          toast(item.archived ? '已停用，历史记录保留' : '已恢复使用');
        });
        dlg.querySelector('#entity-delete').addEventListener('click', async () => {
          if (refs.length) { toast('已有记录引用，不能删除'); return; }
          close();
          const ok = await confirmDialog({
            title: `删除${isWorker ? '人员' : '地点'}？`,
            message: `确定删除 <strong>${esc(item.name)}</strong> 吗？此操作不能撤销。`,
            confirmText: '删除',
            danger: true
          });
          if (!ok) { openEntityEdit(kind, id, onDone); return; }
          if (isWorker) {
            db.workers = db.workers.filter((w) => w.id !== id);
            state.selectedWorkers.delete(id);
          } else {
            db.locations = db.locations.filter((l) => l.id !== id);
            if (state.locationId === id) {
              state.locationId = activeLocations()[0]?.id || null;
              loadFormFromEntry();
            }
          }
          saveDB();
          if (typeof onDone === 'function') onDone(); else render();
          toast('已删除');
        });
      }
    });
  }

  /* ---------------- Export / import ---------------- */
  function downloadBlob(content, filename, mime) {
    try {
      const blob = new Blob([content], { type: mime || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      return true;
    } catch (_) {
      toast('导出失败，请换一个浏览器试试');
      return false;
    }
  }

  function csvCell(value) {
    let text = String(value == null ? '' : value);
    if (/^[=+\-@]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }
  function makeCSV(rows) {
    return `\uFEFF${rows.map((row) => row.map(csvCell).join(',')).join('\r\n')}\r\n`;
  }
  function stampForFile() {
    const d = new Date();
    return `${isoOf(d)}_${pad2(d.getHours())}${pad2(d.getMinutes())}`;
  }

  function exportDetailCSV(entries, label) {
    const rows = [['日期', '星期', '地点', '人员', '工日', '备注']];
    const sorted = entries.slice().sort((a, b) => a.date.localeCompare(b.date) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
    for (const entry of sorted) {
      const location = findLocation(entry.locationId);
      for (const id of entry.workerIds) {
        const worker = findWorker(id);
        rows.push([
          entry.date,
          weekdayLabel(entry.date),
          location ? location.name : '',
          worker ? worker.name : '',
          formatDays(workerDayValue(entry, id)),
          entry.note || ''
        ]);
      }
    }
    downloadBlob(makeCSV(rows), `工日记_${label}_明细_${stampForFile()}.csv`, 'text/csv;charset=utf-8');
    toast('明细 CSV 已导出');
  }

  function exportMonthSummaryCSV(month) {
    const data = computeMonthRaw(month);
    const rows = [['月份', '人员', '工作天数', '出勤地点', '地点明细', '出勤日期']];
    for (const person of data.people) {
      rows.push([
        month,
        person.name,
        formatDays(person.days),
        person.locations.length,
        person.locations.map((x) => `${x.location.name}(${formatDays(x.count)}天)`).join('、'),
        person.dates.map((item) => `${Number(item.date.slice(5, 7))}/${Number(item.date.slice(8, 10))}${item.value === 0.5 ? '（半天）' : ''}`).join('、')
      ]);
    }
    if (!data.people.length) rows.push([month, '（本月没有记录）', 0, 0, '', '']);
    downloadBlob(makeCSV(rows), `工日记_${month}_人员汇总_${stampForFile()}.csv`, 'text/csv;charset=utf-8');
    toast('人员汇总 CSV 已导出');
  }

  function exportYearMatrixCSV(year) {
    const data = computeYear(year);
    const rows = [['人员', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月', '合计']];
    for (const row of data.workers) {
      rows.push([row.worker.name, ...row.months.map((n) => formatDays(n)), formatDays(row.total)]);
    }
    rows.push(['合计', ...data.monthTotals.map((n) => formatDays(n)), formatDays(data.totalPersonDays)]);
    downloadBlob(makeCSV(rows), `工日记_${year}_年度矩阵_${stampForFile()}.csv`, 'text/csv;charset=utf-8');
    toast('年度矩阵 CSV 已导出');
  }

  function exportBackup(share) {
    const envelope = {
      app: 'gongriji',
      format: 'backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: db
    };
    const json = JSON.stringify(envelope, null, 2);
    const filename = `工日记备份_${stampForFile()}.json`;
    const markBackup = () => {
      db.settings.lastBackupAt = new Date().toISOString();
      saveDB({ noEvent: true });
      const backupValue = document.querySelector('[data-action="backup-sheet"] .setting-value');
      if (backupValue) backupValue.textContent = lastBackupLabel();
      document.querySelector('.backup-banner')?.remove();
    };
    if (share && navigator.share && typeof File !== 'undefined') {
      try {
        const file = new File([json], filename, { type: 'application/json' });
        if (!navigator.canShare || navigator.canShare({ files: [file] })) {
          navigator.share({ files: [file], title: '工日记备份', text: '工日记完整备份，请妥善保存。' })
            .then(() => { markBackup(); toast('备份已分享'); })
            .catch((err) => {
              if (err && err.name === 'AbortError') return;
              if (downloadBlob(json, filename, 'application/json')) markBackup();
              toast('已改为下载备份');
            });
          return;
        }
      } catch (_) { /* fall back */ }
    }
    if (downloadBlob(json, filename, 'application/json')) markBackup();
    toast('完整备份已导出');
  }

  function buildTextSummary(scope) {
    const isYear = scope === 'stats-year';
    const isRecords = scope === 'records';
    let title;
    let data;
    if (isYear) {
      const y = computeYear(state.statsYear);
      title = `${y.year}年工日汇总`;
      const lines = [
        title,
        `总工日 ${formatDays(y.totalPersonDays)} 个 · 出勤 ${y.activeWorkers} 人 · 有工 ${y.workdays} 天`,
        ''
      ];
      for (const row of y.workers.filter((w) => w.total > 0)) {
        lines.push(`${row.worker.name}：${formatDays(row.total)} 天`);
      }
      return lines.join('\n');
    }
    if (isRecords) {
      const entries = filteredEntries();
      const assignments = canonicalAssignments(entries);
      const scoped = state.filterWorkerId ? assignments.filter((a) => a.workerId === state.filterWorkerId) : assignments;
      const counts = new Map();
      for (const a of scoped) counts.set(a.workerId, (counts.get(a.workerId) || 0) + a.value);
      const totalDays = scoped.reduce((sum, a) => sum + a.value, 0);
      title = `${monthLabel(state.recordMonth)}记工汇总`;
      const lines = [
        title,
        `有工 ${new Set(scoped.map((a) => a.date)).size} 天 · ${formatDays(totalDays)} 个工日 · ${counts.size} 人`,
        ''
      ];
      for (const [id, count] of Array.from(counts.entries()).sort((a, b) => b[1] - a[1])) {
        const worker = findWorker(id);
        if (worker) lines.push(`${worker.name}：${formatDays(count)} 天`);
      }
      return lines.join('\n');
    }
    data = computeMonthRaw(state.statsMonth);
    title = `${monthLabel(data.month)}工日汇总`;
    const lines = [
      title,
      `总工日 ${formatDays(data.personDays)} 个 · 出勤 ${data.activeWorkers} 人 · 有工 ${data.workdays} 天`,
      ''
    ];
    for (const person of data.people) lines.push(`${person.name}：${formatDays(person.days)} 天`);
    if (data.locations.length) {
      lines.push('');
      lines.push(`地点：${data.locations.map((l) => `${l.name} ${formatDays(l.personDays)}工日`).join(' · ')}`);
    }
    return lines.join('\n');
  }

  function copyPlainText(text) {
    const legacyCopy = () => {
      try {
        const area = document.createElement('textarea');
        area.value = text;
        area.style.position = 'fixed';
        area.style.opacity = '0';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.focus();
        area.select();
        const ok = document.execCommand('copy');
        area.remove();
        return Promise.resolve(ok);
      } catch (_) {
        return Promise.resolve(false);
      }
    };
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(() => true).catch(legacyCopy);
    }
    return legacyCopy();
  }

  function openExportDialog(scope) {
    const isRecords = scope === 'records';
    const isYear = scope === 'stats-year';
    const month = isRecords ? state.recordMonth : state.statsMonth;
    const year = Number((isYear ? state.statsYear : month.slice(0, 4)));
    const entries = isRecords
      ? filteredEntries()
      : isYear
        ? db.entries.filter((e) => e.date.startsWith(String(year)))
        : db.entries.filter((e) => e.date.startsWith(month));
    const label = isRecords ? `${month}_筛选` : isYear ? `${year}年` : month;
    const count = entries.length;
    const row = (action, iconName, title, sub) => `<button type="button" class="setting-row" data-export-kind="${action}">
      <span class="setting-icon primary">${icon(iconName)}</span>
      <span class="setting-main"><span class="setting-title">${esc(title)}</span><span class="setting-sub">${esc(sub)}</span></span>
      ${icon('chevronRight', 'chev')}
    </button>`;

    showSheet({
      title: '导出',
      sub: `${esc(label)} · ${count} 条记录`,
      body: `<div class="list-card">
        ${row('backup', 'shield', '完整备份 JSON', '包含全部人员、地点和记录，用于换手机或恢复')}
        ${row('detail', 'list', '明细 CSV', '一人一行，Excel/WPS 可直接打开')}
        ${isYear ? row('year', 'grid', '年度矩阵 CSV', '每人每月天数，按年汇总') : row('month', 'chart', '人员月度汇总 CSV', '每人天数、地点和出勤日期')}
        ${row('text', 'share', '复制文字汇总', '直接粘贴到微信，不用发文件')}
        ${row('print', 'share', '打印 / 存为 PDF', '适合发给老板或留档')}
      </div>
      <div class="setting-note" style="margin-top:10px;border-radius:9px">${icon('info')} CSV 用 Excel 或 WPS 打开；JSON 备份才能完整恢复。</div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>取消</button>`,
      onMount: (dlg, close) => {
        dlg.querySelectorAll('[data-export-kind]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const kind = btn.getAttribute('data-export-kind');
            close();
            if (kind === 'backup') exportBackup(false);
            else if (kind === 'detail') exportDetailCSV(entries, label);
            else if (kind === 'month') exportMonthSummaryCSV(month);
            else if (kind === 'year') exportYearMatrixCSV(year);
            else if (kind === 'text') {
              copyPlainText(buildTextSummary(scope)).then((ok) => {
                toast(ok ? '文字汇总已复制，可粘贴到微信' : '复制失败，请长按选择文字');
              });
            } else if (kind === 'print') setTimeout(() => window.print(), 200);
          });
        });
      }
    });
  }

  function openBackupDialog() {
    showSheet({
      title: '备份与导出',
      sub: `上次备份：${lastBackupLabel()}`,
      body: `<div class="list-card">
        <button type="button" class="setting-row" data-backup-kind="backup">
          <span class="setting-icon accent">${icon('shield')}</span>
          <span class="setting-main"><span class="setting-title">导出完整备份</span><span class="setting-sub">JSON 文件，换手机或恢复时用</span></span>
          ${icon('download', 'chev')}
        </button>
        <button type="button" class="setting-row" data-backup-kind="share">
          <span class="setting-icon">${icon('share')}</span>
          <span class="setting-main"><span class="setting-title">分享备份文件</span><span class="setting-sub">直接发到微信文件传输助手或网盘</span></span>
          ${icon('chevronRight', 'chev')}
        </button>
        <button type="button" class="setting-row" data-backup-kind="detail">
          <span class="setting-icon">${icon('list')}</span>
          <span class="setting-main"><span class="setting-title">导出全部明细 CSV</span><span class="setting-sub">按人、按天，可用 Excel 继续统计</span></span>
          ${icon('download', 'chev')}
        </button>
        <button type="button" class="setting-row" data-backup-kind="import">
          <span class="setting-icon">${icon('upload')}</span>
          <span class="setting-main"><span class="setting-title">导入备份</span><span class="setting-sub">从 JSON 备份恢复，可合并或覆盖</span></span>
          ${icon('chevronRight', 'chev')}
        </button>
      </div>
      <div class="setting-note" style="margin-top:10px;border-radius:9px">${icon('info')} 数据只在当前浏览器里。清理浏览器数据、卸载应用或换手机前，务必先备份。</div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>关闭</button>`,
      onMount: (dlg, close) => {
        dlg.querySelectorAll('[data-backup-kind]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const kind = btn.getAttribute('data-backup-kind');
            close();
            if (kind === 'backup') exportBackup(false);
            else if (kind === 'share') exportBackup(true);
            else if (kind === 'detail') exportDetailCSV(db.entries, '全部');
            else if (kind === 'import') $('#import-file')?.click();
          });
        });
      }
    });
  }

  function mergeDB(current, incoming) {
    const result = deepClone(current);
    const workerMap = new Map();
    for (const item of incoming.workers) {
      let local = result.workers.find((w) => w.id === item.id)
        || result.workers.find((w) => w.name.toLocaleLowerCase('zh-CN') === item.name.toLocaleLowerCase('zh-CN'));
      if (!local) {
        local = { ...item, id: uid('w') };
        result.workers.push(local);
      }
      if (item.id) workerMap.set(item.id, local.id);
    }
    const locationMap = new Map();
    for (const item of incoming.locations) {
      let local = result.locations.find((l) => l.id === item.id)
        || result.locations.find((l) => l.name.toLocaleLowerCase('zh-CN') === item.name.toLocaleLowerCase('zh-CN'));
      if (!local) {
        local = { ...item, id: uid('l') };
        result.locations.push(local);
      }
      if (item.id) locationMap.set(item.id, local.id);
    }
    for (const entry of incoming.entries) {
      const locationId = locationMap.get(entry.locationId) || entry.locationId;
      if (!result.locations.some((l) => l.id === locationId)) continue;
      const workerIds = [];
      for (const id of entry.workerIds) {
        const mapped = workerMap.get(id) || id;
        if (result.workers.some((w) => w.id === mapped) && !workerIds.includes(mapped)) workerIds.push(mapped);
      }
      if (!workerIds.length) continue;
      const halfDayWorkerIds = entryHalfIds(entry)
        .map((id) => workerMap.get(id) || id)
        .filter((id) => workerIds.includes(id));
      const existing = result.entries.find((e) => e.date === entry.date && e.locationId === locationId);
      if (existing) {
        if (!Array.isArray(existing.halfDayWorkerIds)) existing.halfDayWorkerIds = [];
        for (const id of workerIds) if (!existing.workerIds.includes(id)) existing.workerIds.push(id);
        for (const id of halfDayWorkerIds) if (!existing.halfDayWorkerIds.includes(id)) existing.halfDayWorkerIds.push(id);
        if (!existing.note && entry.note) existing.note = entry.note;
        if (String(entry.updatedAt) > String(existing.updatedAt)) existing.updatedAt = entry.updatedAt;
      } else {
        result.entries.push({ ...entry, id: uid('e'), locationId, workerIds, halfDayWorkerIds });
      }
    }
    result.onboarded = true;
    result.updatedAt = new Date().toISOString();
    return result;
  }

  async function handleImportFile(file) {
    if (!file) return;
    let parsed;
    try {
      const text = await file.text();
      parsed = JSON.parse(text);
    } catch (_) {
      toast('文件读不出来，请选择工日记导出的 JSON 备份');
      return;
    }
    const incoming = normalizeDB(parsed);
    if (!incoming) {
      toast('这不是有效的工日记备份文件');
      return;
    }
    const entryCount = incoming.entries.length;
    const workerCount = incoming.workers.length;
    const locationCount = incoming.locations.length;
    if (!entryCount && !workerCount && !locationCount) {
      toast('备份里没有可导入的数据');
      return;
    }
    const exportedAt = parsed && parsed.exportedAt ? formatTime(parsed.exportedAt) : '';

    showSheet({
      title: '导入备份',
      sub: exportedAt ? `备份时间：${exportedAt}` : '请选择导入方式',
      body: `<div class="dialog-message">备份包含 <strong>${workerCount} 人</strong>、<strong>${locationCount} 个地点</strong>、<strong>${entryCount} 条记录</strong>。</div>
        <div class="dialog-note">“合并”会保留当前数据，只补充备份里没有的人和记录；“覆盖”会用备份替换当前全部数据。两种方式都会先自动留存一份当前数据。</div>
        <div class="dialog-list">
          <div class="dialog-list-item">${icon('users')} 人员：${workerCount} 人</div>
          <div class="dialog-list-item">${icon('pin')} 地点：${locationCount} 个</div>
          <div class="dialog-list-item">${icon('calendar')} 记录：${entryCount} 条</div>
        </div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>取消</button><button type="button" class="btn btn-soft" id="import-merge">合并导入</button><button type="button" class="btn btn-primary" id="import-replace">覆盖导入</button>`,
      onMount: (dlg, close) => {
        const finish = (nextDB, message) => {
          snapshotDaily();
          db = nextDB;
          saveDB();
          state.view = 'record';
          state.date = todayISO();
          initFormState();
          state.recordMonth = currentMonth();
          state.statsMonth = currentMonth();
          state.statsYear = new Date().getFullYear();
          close();
          render();
          toast(message);
        };
        dlg.querySelector('#import-merge').addEventListener('click', () => {
          finish(mergeDB(db, incoming), '已合并导入');
        });
        dlg.querySelector('#import-replace').addEventListener('click', async () => {
          close();
          const ok = await confirmDialog({
            title: '覆盖当前全部数据？',
            message: '备份会替换当前手机上的所有人员、地点和记录。当前数据会先自动留存一份，但建议你先导出一次备份。',
            confirmText: '覆盖导入',
            danger: true
          });
          if (!ok) return;
          snapshotDaily();
          db = incoming;
          db.onboarded = true;
          saveDB();
          state.view = 'record';
          state.date = todayISO();
          initFormState();
          state.recordMonth = currentMonth();
          state.statsMonth = currentMonth();
          state.statsYear = new Date().getFullYear();
          render();
          toast('备份已覆盖导入');
        });
      }
    });
  }

  /* ---------------- Day, filter, install, help ---------------- */
  function openDayDialog(date) {
    const entries = db.entries.filter((e) => e.date === date);
    const people = new Set(entries.flatMap((e) => e.workerIds));
    const days = entries.reduce((sum, e) => sum + entryDays(e), 0);
    showSheet({
      title: `${dateLabel(date)} ${weekdayLabel(date)}`,
      sub: entries.length ? `${entries.length} 个地点 · ${people.size} 人${days !== people.size ? ` · ${formatDays(days)} 工日` : ''}` : '这一天还没有记录',
      body: entries.length ? `<div class="stack gap-8">${entries.map((entry) => {
        const location = findLocation(entry.locationId);
        if (!location) return '';
        return `<div class="entry-card" style="box-shadow:none">
          <div class="entry-head"><div class="entry-loc">${dotHTML(location)}<strong>${esc(location.name)}</strong></div><span class="entry-meta">${entryMetaText(entry)}</span></div>
          ${entryPeopleHTML(entry)}
          ${entry.note ? `<div class="entry-note">${esc(entry.note)}</div>` : ''}
          <div class="row gap-6" style="margin-top:9px"><button type="button" class="btn btn-soft btn-sm" data-day-edit="${esc(entry.id)}">${icon('edit')} 编辑这条</button></div>
        </div>`;
      }).join('')}</div>` : `<div class="entry-empty">${icon('calendar')}<div>这天没有记录</div><div class="small" style="margin-top:3px">可以直接去补记。</div></div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>关闭</button><button type="button" class="btn btn-primary" id="day-record">${icon('plus')} 去记这一天</button>`,
      onMount: (dlg, close) => {
        const go = (entry) => {
          state.date = date;
          state.followToday = date === todayISO();
          if (entry) state.locationId = entry.locationId;
          else if (!state.locationId || !findLocation(state.locationId)) {
            state.locationId = activeLocations()[0]?.id || null;
          }
          loadFormFromEntry();
          state.view = 'record';
          state.focusForm = true;
          close();
          render();
        };
        dlg.querySelectorAll('[data-day-edit]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const entry = findEntry(btn.getAttribute('data-day-edit'));
            if (entry) go(entry);
          });
        });
        dlg.querySelector('#day-record').addEventListener('click', () => go(null));
      }
    });
  }

  function openFilterDialog() {
    const workers = db.workers.slice().sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    const locations = db.locations.slice().sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    showSheet({
      title: '筛选记录',
      sub: '人员、地点可以只选一个，也可以同时选。',
      body: `<div class="field"><label for="filter-worker">工作人员</label><select id="filter-worker"><option value="">全部人员</option>${workers.map((w) => `<option value="${esc(w.id)}"${state.filterWorkerId === w.id ? ' selected' : ''}>${esc(w.name)}${w.archived ? '（已停用）' : ''}</option>`).join('')}</select></div>
        <div class="field"><label for="filter-location">工作地点</label><select id="filter-location"><option value="">全部地点</option>${locations.map((l) => `<option value="${esc(l.id)}"${state.filterLocationId === l.id ? ' selected' : ''}>${esc(l.name)}${l.archived ? '（已停用）' : ''}</option>`).join('')}</select></div>`,
      footer: `<button type="button" class="btn btn-ghost" id="filter-clear">清除</button><button type="button" class="btn btn-primary" id="filter-apply">应用筛选</button>`,
      onMount: (dlg, close) => {
        dlg.querySelector('#filter-clear').addEventListener('click', () => {
          state.filterWorkerId = '';
          state.filterLocationId = '';
          close();
          render();
        });
        dlg.querySelector('#filter-apply').addEventListener('click', () => {
          state.filterWorkerId = dlg.querySelector('#filter-worker').value;
          state.filterLocationId = dlg.querySelector('#filter-location').value;
          close();
          render();
        });
      }
    });
  }

  function openMonthPicker(context) {
    const isStats = context === 'stats';
    const selected = isStats ? state.statsMonth : state.recordMonth;
    let year = Number(String(selected).slice(0, 4));
    const maxMonth = currentMonth();
    const maxYear = Number(maxMonth.slice(0, 4));

    showSheet({
      title: '选择月份',
      sub: isStats ? '看哪个月的统计' : '看哪个月的记录',
      body: `<div class="month-picker">
        <div class="month-year">
          <button type="button" id="mp-prev" aria-label="上一年">${icon('chevronLeft')}</button>
          <strong id="mp-year">${year}年</strong>
          <button type="button" id="mp-next" aria-label="下一年">${icon('chevronRight')}</button>
        </div>
        <div class="month-grid" id="mp-grid"></div>
        <div class="month-picker-note">只能查看已经到来的月份</div>
      </div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>取消</button>`,
      onMount: (dlg, close) => {
        const grid = dlg.querySelector('#mp-grid');
        const yearLabel = dlg.querySelector('#mp-year');
        const nextBtn = dlg.querySelector('#mp-next');
        const draw = () => {
          yearLabel.textContent = `${year}年`;
          nextBtn.disabled = year >= maxYear;
          grid.innerHTML = Array.from({ length: 12 }, (_, i) => {
            const value = `${year}-${pad2(i + 1)}`;
            const disabled = value > maxMonth;
            const active = value === selected;
            return `<button type="button" class="month-cell${active ? ' active' : ''}" data-month-value="${value}" ${disabled ? 'disabled' : ''}>${i + 1}月</button>`;
          }).join('');
        };
        draw();
        dlg.querySelector('#mp-prev').addEventListener('click', () => { year -= 1; draw(); });
        nextBtn.addEventListener('click', () => { if (year < maxYear) { year += 1; draw(); } });
        grid.addEventListener('click', (event) => {
          const btn = event.target.closest('[data-month-value]');
          if (!btn || btn.disabled) return;
          const value = btn.getAttribute('data-month-value');
          if (isStats) {
            state.statsMonth = value;
            state.statsMode = 'month';
          } else {
            state.recordMonth = value;
          }
          close();
          render();
        });
      }
    });
  }

  function openInstallHelp() {
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isWeChat = /MicroMessenger/i.test(ua);
    const inStandalone = isStandalone();

    let body = '';
    if (inStandalone) {
      body = `<div class="dialog-message">已经安装好了。以后从手机桌面的“工日记”图标打开即可，没网也能记。</div>
        <div class="dialog-note">如果换了手机，先在新手机打开同一个网址安装，再导入 JSON 备份。</div>`;
    } else if (isWeChat) {
      body = `<div class="dialog-message">你现在在微信里打开，先把页面转到浏览器：</div>
        <ol class="help-steps"><li>点右上角 <strong>…</strong></li><li>选择 <strong>“在浏览器打开”</strong></li><li>再按下面的方法安装</li></ol>
        <div class="dialog-note">推荐用 Safari（iPhone）或 Chrome（安卓）。</div>`;
    } else if (isIOS) {
      body = `<div class="dialog-message">iPhone / iPad 用 Safari 安装：</div>
        <ol class="help-steps"><li>点屏幕底部的 <strong>分享</strong> 按钮（方框向上箭头）</li><li>往下找到 <strong>“添加到主屏幕”</strong></li><li>点右上角 <strong>“添加”</strong></li></ol>
        <div class="dialog-note">安装后从桌面图标打开，界面更像 App，也能离线使用。数据仍然只保存在这台手机。</div>`;
    } else {
      body = `<div class="dialog-message">安卓手机用 Chrome 或系统浏览器安装：</div>
        <ol class="help-steps"><li>点浏览器右上角的 <strong>⋮</strong> 菜单</li><li>选择 <strong>“安装应用”</strong> 或 <strong>“添加到主屏幕”</strong></li><li>确认添加</li></ol>
        <div class="dialog-note">部分浏览器把入口叫“添加到桌面”。安装后可离线打开。</div>`;
    }

    showSheet({
      title: inStandalone ? '已安装' : '安装到手机桌面',
      sub: '像 App 一样打开，没网也能记',
      body,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>知道了</button>${!inStandalone && deferredPrompt ? '<button type="button" class="btn btn-primary" id="install-now">立即安装</button>' : ''}`,
      onMount: (dlg, close) => {
        const btn = dlg.querySelector('#install-now');
        if (!btn) return;
        btn.addEventListener('click', async () => {
          if (!deferredPrompt) return;
          const prompt = deferredPrompt;
          deferredPrompt = null;
          close();
          try {
            prompt.prompt();
            const choice = await prompt.userChoice;
            if (choice && choice.outcome === 'accepted') toast('已开始安装');
            else toast('已取消安装');
          } catch (_) { toast('请按浏览器提示安装'); }
        });
      }
    });
  }

  function openHelpDialog() {
    showSheet({
      title: '使用说明',
      sub: '三步记好一天，月底自动统计',
      body: `<div class="help-block">
          <h3>${icon('book')} 记一天工</h3>
          <ol class="help-steps"><li>日期默认今天，点大数字可以改日期。</li><li>点一个工作地点。</li><li>勾选当天在场的人员，点底部“保存记录”。</li></ol>
        </div>
        <div class="help-block">
          <h3>${icon('clock')} 半天怎么记</h3>
          <p>勾选人员后，下面会出现“工日计算”一行。默认每个人 1 天，点某个人的名字就切成 0.5 天，再点一下切回全天。统计、年度表和导出都会按 0.5 计算。</p>
        </div>
        <div class="help-block">
          <h3>${icon('users')} 更快一点</h3>
          <p>人员固定的话，点地点下面的“沿用上次人员”一键带入；日期默认今天，地点会记住上次用的。第一次可以一次粘贴多个姓名/地点。</p>
        </div>
        <div class="help-block">
          <h3>${icon('chart')} 看统计</h3>
          <p>“统计 → 月度”按人、按地点、按天汇总；“统计 → 年度”是一张每人×12个月的工日表。点人员那一行可以展开看出勤日期和地点分布。</p>
        </div>
        <div class="help-block">
          <h3>${icon('shield')} 备份</h3>
          <p>数据只保存在当前浏览器。建议每月到“设置 → 备份与导出”保存一次 JSON 备份，发到微信文件传输助手或网盘。换手机时在新手机安装后导入即可。</p>
        </div>
        <div class="help-block">
          <h3>${icon('users')} 一人一天只算一天</h3>
          <p>同一个人同一天如果已经在别的记录里，保存时会提示并跳过，避免重复算工日。需要改地点，直接编辑当天那条记录。</p>
        </div>
        <div class="dialog-note">小技巧：首次可以一次粘贴多个姓名/地点，用逗号、顿号或换行分开。</div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>知道了</button><button type="button" class="btn btn-primary" data-action="nav" data-view="record" data-sheet-close>开始记工</button>`
    });
  }

  function openAboutDialog() {
    showSheet({
      title: '关于工日记',
      sub: `版本 ${APP_VERSION} · 本地优先`,
      body: `<div class="about-mark">${icon('book')}</div>
        <div class="dialog-message" style="text-align:center;margin-top:8px"><strong>谁 · 哪天 · 在哪 · 干了几天</strong><br>一个给干活的人用的记工小工具。</div>
        <div class="divider"></div>
        <div class="dialog-message">
          <p><strong>数据怎么保存？</strong><br>用浏览器自带的本地存储（localStorage）保存，相当于这个网址在手机里的一小块本地数据。没有账号、没有云端、没有上传。</p>
          <div style="height:10px"></div>
          <p><strong>可靠吗？</strong><br>日常开关 App、重启手机、离线使用都没问题；App 也会申请“持久存储”。但它不是永久保险：清理浏览器数据、卸载 App、换手机/换网址、无痕模式、系统空间不足、长期不用被系统清理，都可能让数据消失。<br>自动备份也存在同一个浏览器里，不能代替导出到手机外。</p>
          <div style="height:10px"></div>
          <p><strong>最稳妥的做法</strong><br>每月到“设置 → 备份与导出”保存一次 JSON，发到微信文件传输助手或网盘。</p>
          <div style="height:10px"></div>
          <p><strong>需要联网吗？</strong><br>安装到桌面后，第一次打开之后可以离线使用；打开新版本时需要网络。</p>
        </div>
        <div class="dialog-note">建议把网址收藏，并把“工日记”添加到手机桌面。这个页面不会被搜索引擎收录。</div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>关闭</button><button type="button" class="btn btn-primary" data-action="backup-sheet" data-sheet-close>去备份</button>`
    });
  }

  function openSnapshotsDialog() {
    const snapshots = getSnapshots();
    showSheet({
      title: '自动备份',
      sub: '每天第一次修改前自动留存，最多保留4份',
      body: snapshots.length ? `<div class="list-card">${snapshots.map((snap, index) => {
        const count = snap.data && snap.data.entries ? snap.data.entries.length : 0;
        const workerCount = snap.data && snap.data.workers ? snap.data.workers.length : 0;
        return `<div class="setting-row">
          <span class="setting-icon">${icon('clock')}</span>
          <span class="setting-main"><span class="setting-title">${esc(formatTime(snap.at))}${index === 0 ? ' · 最近' : ''}</span><span class="setting-sub">${count} 条记录 · ${workerCount} 人</span></span>
          <button type="button" class="btn btn-soft btn-sm" data-restore-snapshot="${index}">恢复</button>
        </div>`;
      }).join('')}</div>` : `<div class="entry-empty">${icon('clock')}<div>还没有自动备份</div><div class="small" style="margin-top:3px">有记录后，每天第一次修改前会自动留存。</div></div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>关闭</button>`,
      onMount: (dlg, close) => {
        dlg.querySelectorAll('[data-restore-snapshot]').forEach((btn) => {
          btn.addEventListener('click', async () => {
            const snap = snapshots[Number(btn.getAttribute('data-restore-snapshot'))];
            if (!snap) return;
            close();
            const ok = await confirmDialog({
              title: '恢复这份自动备份？',
              message: `将用 <strong>${esc(formatTime(snap.at))}</strong> 的数据替换当前内容。当前数据会先另存一份。`,
              confirmText: '恢复',
              danger: true
            });
            if (!ok) return;
            const current = deepClone(db);
            db = normalizeDB(snap.data) || current;
            db.onboarded = true;
            try {
              const list = getSnapshots();
              list.unshift({ at: new Date().toISOString(), day: todayISO(), data: current });
              while (list.length > 4) list.pop();
              localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(list));
            } catch (_) { /* ignore */ }
            saveDB();
            state.view = 'record';
            state.date = todayISO();
            initFormState();
            render();
            toast('已恢复自动备份');
          });
        });
      }
    });
  }

  function openClearDataDialog() {
    showSheet({
      title: '清空所有数据',
      sub: '这个操作不能撤销',
      body: `<div class="dialog-message">会删除这台手机上的<strong>全部人员、工作地点、记工记录和自动备份</strong>。</div>
        <div class="dialog-note" style="color:var(--danger)">如果只是换手机，请不要清空，先导出 JSON 备份。</div>
        <div class="field" style="margin-top:14px"><label for="clear-confirm">输入“删除”两个字确认</label><input id="clear-confirm" type="text" autocomplete="off" placeholder="删除" data-autofocus></div>`,
      footer: `<button type="button" class="btn btn-ghost" data-sheet-close>取消</button><button type="button" class="btn btn-danger" id="clear-do" disabled>确认清空</button>`,
      onMount: (dlg, close) => {
        const input = dlg.querySelector('#clear-confirm');
        const btn = dlg.querySelector('#clear-do');
        input.addEventListener('input', () => {
          btn.disabled = input.value.trim() !== '删除';
        });
        btn.addEventListener('click', () => {
          if (input.value.trim() !== '删除') return;
          try {
            localStorage.removeItem(DATA_KEY);
            localStorage.removeItem(SNAPSHOT_KEY);
          } catch (_) { /* ignore */ }
          db = blankDB();
          state.view = 'record';
          state.date = todayISO();
          state.locationId = null;
          state.selectedWorkers = new Set();
          state.note = '';
          state.recordMonth = currentMonth();
          state.statsMonth = currentMonth();
          close();
          render();
          toast('数据已清空');
        });
      }
    });
  }

  /* ---------------- Core actions ---------------- */
  async function withDirtyGuard(fn) {
    if (!isDirty()) {
      fn();
      return true;
    }
    const ok = await confirmDialog({
      title: '有改动还没保存',
      message: '切换后会丢掉当前勾选和备注。',
      note: '选“继续切换”会放弃这些改动；想保留就先“回去保存”。',
      cancelText: '回去保存',
      confirmText: '继续切换',
      danger: true
    });
    if (!ok) {
      render();
      return false;
    }
    fn();
    return true;
  }

  async function changeDate(iso, followToday) {
    if (!isValidISO(iso)) {
      render();
      return;
    }
    if (iso > todayISO()) {
      toast('还没到这一天，不能记未来的日期');
      render();
      return;
    }
    if (iso === state.date) {
      state.followToday = !!followToday;
      render();
      return;
    }
    const pending = !state.locationId ? {
      workers: new Set(state.selectedWorkers),
      half: new Set(state.halfDayWorkers),
      note: state.note
    } : null;
    await withDirtyGuard(() => {
      state.date = iso;
      state.followToday = !!followToday;
      state.workerSearch = '';
      loadFormFromEntry();
      if (pending) {
        state.selectedWorkers = pending.workers;
        state.halfDayWorkers = pending.half;
        state.note = pending.note;
      }
      render();
    });
  }

  async function selectLocation(id) {
    if (!findLocation(id)) return;
    if (id === state.locationId) return;
    const pending = !state.locationId ? {
      workers: new Set(state.selectedWorkers),
      half: new Set(state.halfDayWorkers),
      note: state.note
    } : null;
    await withDirtyGuard(() => {
      state.locationId = id;
      state.workerSearch = '';
      loadFormFromEntry();
      if (pending && !currentEntry()) {
        state.selectedWorkers = pending.workers;
        state.halfDayWorkers = pending.half;
        state.note = pending.note;
      }
      render();
    });
  }

  function updateSaveDock() {
    const btn = $('[data-action="save-entry"]');
    if (!btn) return;
    const entry = currentEntry();
    const selected = selectedWorkerIds();
    const location = findLocation(state.locationId);
    const dirty = isDirty();
    const halfCount = Array.from(state.halfDayWorkers).filter((id) => state.selectedWorkers.has(id)).length;
    const totalDays = selected.length - halfCount * 0.5;
    btn.disabled = !location || !selected.length || (!dirty && !!entry);
    btn.classList.toggle('is-saved', !!entry && !dirty);
    btn.textContent = entry ? (dirty ? '保存修改' : '已保存') : '保存记录';
    const title = $('.save-title');
    if (title) {
      title.innerHTML = `${dirty ? '<span class="dirty-dot"></span>' : ''}${location ? esc(location.name) : '还没有选地点'}${selected.length ? ` · ${selected.length}人` : ''}`;
    }
    const sub = $('.save-sub');
    if (sub) {
      sub.textContent = selected.length
        ? `${entry ? '修改' : '新增'} · ${formatDays(totalDays)} 工日 · ${dateLabel(state.date)}`
        : '勾选人员后保存';
    }
  }

  function askConflict(conflicts, remainingCount) {
    return new Promise((resolve) => {
      let settled = false;
      let closeFn = null;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        if (closeFn) closeFn();
        resolve(value);
      };
      const items = conflicts.map(({ workerId, entry }) => {
        const worker = findWorker(workerId);
        const location = findLocation(entry.locationId);
        return `<div class="dialog-list-item">${worker ? avatarHTML(worker) : ''}<span class="grow"><strong>${esc(worker ? worker.name : '')}</strong> 当天已记在 ${esc(location ? location.name : '其他地点')}</span></div>`;
      }).join('');
      const footer = remainingCount
        ? `<button type="button" class="btn btn-ghost" data-conflict-cancel>取消</button><button type="button" class="btn btn-primary" data-conflict-ok>跳过重复并保存</button>`
        : `<button type="button" class="btn btn-primary" data-conflict-ok>知道了</button>`;
      const sheet = showSheet({
        title: '有人当天已经记过',
        sub: '同一个人一天只算一天，避免工日重复。',
        body: `<div class="dialog-message">下面这些人员当天在别的地点已有记录：</div><div class="dialog-list">${items}</div><div class="dialog-note">${remainingCount ? '继续保存会跳过这些人员，其余人员正常保存。要改地点，请直接编辑当天那条记录。' : '所选人员都已经记过，本次没有需要保存的人。'}</div>`,
        footer,
        onClose: () => finish(false),
        onMount: (dlg, close) => {
          closeFn = close;
          dlg.querySelector('[data-conflict-cancel]')?.addEventListener('click', () => finish(false));
          dlg.querySelector('[data-conflict-ok]').addEventListener('click', () => finish(remainingCount > 0));
          setTimeout(() => dlg.querySelector('[data-conflict-ok]')?.focus(), 50);
        }
      });
      if (sheet) closeFn = sheet.close;
    });
  }

  async function handleSave() {
    const location = findLocation(state.locationId);
    const ids = selectedWorkerIds();
    if (!location) { toast('先选一个工作地点'); return; }
    if (!ids.length) { toast('至少勾选一名工作人员'); return; }
    const entry = currentEntry();
    const conflicts = findWorkerConflicts(ids, state.date, location.id, entry ? entry.id : null);
    if (conflicts.length) {
      const conflictIds = new Set(conflicts.map((c) => c.workerId));
      const remaining = ids.filter((id) => !conflictIds.has(id));
      const ok = await askConflict(conflicts, remaining.length);
      if (!ok) return;
      if (!remaining.length) {
        toast('所选人员当天都已经记过');
        return;
      }
      commitSave(remaining, location);
      return;
    }
    commitSave(ids, location);
  }

  function commitSave(ids, location) {
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => { /* best effort */ });
    }
    snapshotDaily();
    const existing = currentEntry();
    const previous = existing ? deepClone(existing) : null;
    const now = new Date().toISOString();
    const note = String(state.note || '').trim();
    const halfIds = Array.from(state.halfDayWorkers).filter((id) => ids.includes(id));
    const totalDays = ids.reduce((sum, id) => sum + (halfIds.includes(id) ? 0.5 : 1), 0);
    let savedId = null;

    if (existing) {
      existing.workerIds = ids.slice();
      existing.halfDayWorkerIds = halfIds;
      existing.note = note;
      existing.updatedAt = now;
      savedId = existing.id;
    } else {
      const entry = {
        id: uid('e'),
        date: state.date,
        locationId: location.id,
        workerIds: ids.slice(),
        halfDayWorkerIds: halfIds,
        note,
        createdAt: now,
        updatedAt: now
      };
      db.entries.push(entry);
      savedId = entry.id;
    }
    db.settings.lastLocationId = location.id;
    saveDB();
    state.selectedWorkers = new Set(ids);
    state.halfDayWorkers = new Set(halfIds);
    state.note = note;
    render();
    vibrate(18);
    const message = `已保存：${location.name} · ${ids.length}人${totalDays !== ids.length ? ` / ${formatDays(totalDays)}工日` : ''}`;
    toast(message, {
      actionLabel: '撤销',
      onAction: () => {
        if (previous) {
          db.entries = db.entries.map((e) => (e.id === previous.id ? previous : e));
        } else {
          db.entries = db.entries.filter((e) => e.id !== savedId);
        }
        saveDB();
        state.selectedWorkers = new Set(previous ? previous.workerIds : []);
        state.note = previous ? previous.note : '';
        loadFormFromEntry();
        render();
        toast('已撤销');
      }
    });
  }

  async function deleteEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    const location = findLocation(entry.locationId);
    const ok = await confirmDialog({
      title: '删除这条记录？',
      message: `将删除 <strong>${esc(location ? location.name : '该地点')}</strong> ${esc(dateLabel(entry.date))} 的 ${entry.workerIds.length} 人记录${entryDays(entry) !== entry.workerIds.length ? `（${formatDays(entryDays(entry))} 工日）` : ''}。`,
      note: '删除后可以用提示里的“撤销”恢复。',
      confirmText: '删除',
      danger: true
    });
    if (!ok) return;
    snapshotDaily();
    const index = db.entries.findIndex((e) => e.id === id);
    if (index < 0) return;
    const removed = db.entries[index];
    db.entries.splice(index, 1);
    saveDB();
    loadFormFromEntry();
    render();
    toast('记录已删除', {
      actionLabel: '撤销',
      onAction: () => {
        db.entries.splice(Math.min(index, db.entries.length), 0, removed);
        saveDB();
        loadFormFromEntry();
        render();
        toast('已恢复记录');
      }
    });
  }

  async function editEntry(id) {
    const entry = findEntry(id);
    if (!entry) return;
    await withDirtyGuard(() => {
      state.date = entry.date;
      state.followToday = entry.date === todayISO();
      state.locationId = entry.locationId;
      state.workerSearch = '';
      loadFormFromEntry();
      state.view = 'record';
      state.focusForm = true;
      render();
    });
  }

  function finishOnboarding() {
    const workerInput = $('#ob-workers');
    const locationInput = $('#ob-locations');
    const workers = workerInput ? uniqueNames(parseWorkerNames(workerInput.value)) : [];
    const locations = locationInput ? uniqueNames(parseLocationNames(locationInput.value)) : [];
    if (!workers.length && !locations.length) {
      toast('先填一个人或一个地点，或者点“先跳过”');
      return;
    }
    if (navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().catch(() => { /* best effort */ });
    }
    addWorkers(workers, { touch: true });
    addLocations(locations, { touch: true });
    db.onboarded = true;
    const firstLocation = activeLocations()[0];
    db.settings.lastLocationId = firstLocation ? firstLocation.id : null;
    saveDB();
    initFormState();
    state.view = 'record';
    render();
    toast(workers.length || locations.length ? '设置好了，开始记工' : '已跳过');
  }

  function skipOnboarding() {
    db.onboarded = true;
    saveDB();
    initFormState();
    state.view = 'record';
    render();
    toast('可以开始了，人员/地点随时能加');
  }

  function updateConnectivity() {
    const el = $('#offline-banner');
    if (el) el.classList.toggle('hidden', navigator.onLine);
  }

  function maybeRollover() {
    const today = todayISO();
    if (state.followToday && state.date !== today && !isDirty()) {
      state.date = today;
      loadFormFromEntry();
      if (state.view === 'record') render();
    }
  }

  /* ---------------- Events ---------------- */
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');
    const id = target.getAttribute('data-id');
    const scope = target.getAttribute('data-scope');

    switch (action) {
      case 'nav':
        switchView(target.getAttribute('data-view'));
        break;
      case 'date-prev':
        changeDate(addDays(state.date, -1), false);
        break;
      case 'date-next':
        if (state.date >= todayISO()) toast('今天就是最新的一天');
        else changeDate(addDays(state.date, 1), false);
        break;
      case 'date-today':
        changeDate(todayISO(), true);
        break;
      case 'date-yesterday':
        changeDate(addDays(todayISO(), -1), false);
        break;
      case 'focus-date': {
        const input = $('#date-input');
        if (!input) break;
        try { if (input.showPicker) { input.showPicker(); break; } } catch (_) { /* fall through */ }
        input.focus();
        input.click();
        break;
      }
      case 'location-select':
        selectLocation(id);
        break;
      case 'worker-toggle': {
        if (!findWorker(id)) break;
        if (state.selectedWorkers.has(id)) {
          state.selectedWorkers.delete(id);
          state.halfDayWorkers.delete(id);
        } else {
          state.selectedWorkers.add(id);
        }
        render();
        break;
      }
      case 'toggle-half': {
        if (!state.selectedWorkers.has(id)) break;
        if (state.halfDayWorkers.has(id)) state.halfDayWorkers.delete(id);
        else state.halfDayWorkers.add(id);
        render();
        vibrate(8);
        break;
      }
      case 'worker-all': {
        for (const worker of activeWorkers()) state.selectedWorkers.add(worker.id);
        render();
        break;
      }
      case 'reuse-last': {
        const source = findEntry(id);
        if (!source) break;
        const reuse = source.workerIds.filter((wid) => {
          const worker = findWorker(wid);
          return worker && !worker.archived;
        });
        if (!reuse.length) { toast('上次的人员都已停用'); break; }
        state.selectedWorkers = new Set(reuse);
        state.halfDayWorkers = new Set(entryHalfIds(source).filter((wid) => reuse.includes(wid)));
        render();
        toast(`已带入 ${reuse.length} 人，确认后保存`);
        break;
      }
      case 'worker-none':
        state.selectedWorkers.clear();
        state.halfDayWorkers.clear();
        render();
        break;
      case 'add-worker':
        openAddWorkersDialog({ record: state.view === 'record' });
        break;
      case 'add-location':
        openAddLocationsDialog({});
        break;
      case 'save-entry':
        handleSave();
        break;
      case 'edit-entry':
        editEntry(id);
        break;
      case 'delete-entry':
        deleteEntry(id);
        break;
      case 'record-month-prev':
        state.recordMonth = addMonths(state.recordMonth, -1);
        render();
        break;
      case 'record-month-next':
        if (state.recordMonth >= currentMonth()) { toast('已经是最新的月份'); break; }
        state.recordMonth = addMonths(state.recordMonth, 1);
        render();
        break;
      case 'stats-month-prev':
        state.statsMonth = addMonths(state.statsMonth, -1);
        render();
        break;
      case 'stats-month-next':
        if (state.statsMonth >= currentMonth()) { toast('已经是最新的月份'); break; }
        state.statsMonth = addMonths(state.statsMonth, 1);
        render();
        break;
      case 'stats-year-prev':
        state.statsYear -= 1;
        render();
        break;
      case 'stats-year-next':
        if (state.statsYear >= new Date().getFullYear()) { toast('已经是最新的年份'); break; }
        state.statsYear += 1;
        render();
        break;
      case 'stats-mode':
        state.statsMode = target.getAttribute('data-mode') === 'year' ? 'year' : 'month';
        render();
        break;
      case 'open-month-picker':
        openMonthPicker(target.getAttribute('data-context') === 'stats' ? 'stats' : 'record');
        break;
      case 'jump-month':
        state.statsMonth = target.getAttribute('data-month');
        state.statsMode = 'month';
        state.scrollTopOnRender = true;
        render();
        break;
      case 'cal-day':
        openDayDialog(target.getAttribute('data-date'));
        break;
      case 'open-filter':
        openFilterDialog();
        break;
      case 'clear-worker-filter':
        state.filterWorkerId = '';
        render();
        break;
      case 'clear-location-filter':
        state.filterLocationId = '';
        render();
        break;
      case 'clear-search':
        state.search = '';
        render();
        break;
      case 'export':
        openExportDialog(scope || 'records');
        break;
      case 'backup-sheet':
        openBackupDialog();
        break;
      case 'snooze-backup':
        prefs.backupSnoozedUntil = Date.now() + 7 * 86400000;
        savePrefs();
        render();
        toast('7天后再提醒，记得抽空备份');
        break;
      case 'import-trigger':
        $('#import-file')?.click();
        break;
      case 'snapshots':
        openSnapshotsDialog();
        break;
      case 'manage-workers':
        openManageDialog('worker');
        break;
      case 'manage-locations':
        openManageDialog('location');
        break;
      case 'set-theme':
        prefs.theme = target.getAttribute('data-theme');
        savePrefs();
        applyTheme();
        render();
        break;
      case 'install':
        openInstallHelp();
        break;
      case 'help':
        openHelpDialog();
        break;
      case 'about':
        openAboutDialog();
        break;
      case 'clear-data':
        openClearDataDialog();
        break;
      case 'onboard-start':
        finishOnboarding();
        break;
      case 'onboard-skip':
        skipOnboarding();
        break;
      case 'onboard-restore':
        openSnapshotsDialog();
        break;
      default:
        break;
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.id === 'date-input') {
      changeDate(target.value, target.value === todayISO());
    } else if (target.id === 'import-file') {
      const file = target.files && target.files[0];
      target.value = '';
      handleImportFile(file);
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.id === 'note-input') {
      state.note = target.value;
      resizeNote();
      updateSaveDock();
    } else if (target.id === 'worker-search') {
      state.workerSearch = target.value;
      const grid = $('#worker-grid');
      if (grid) grid.innerHTML = workerGridHTML();
    } else if (target.id === 'record-search') {
      state.search = target.value;
      const results = $('#records-results');
      if (results) results.innerHTML = recordsResultsHTML();
      const clear = $('#search-clear');
      if (clear) clear.classList.toggle('hidden', !state.search);
    }
  });

  window.addEventListener('scroll', updateTopbarScroll, { passive: true });
  window.addEventListener('online', updateConnectivity);
  window.addEventListener('offline', updateConnectivity);
  window.addEventListener('beforeunload', (event) => {
    if (db.onboarded && state.view === 'record' && isDirty()) {
      event.preventDefault();
      event.returnValue = '';
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateConnectivity();
      maybeRollover();
    }
  });

  /* ---------------- PWA ---------------- */
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    toast('已安装到桌面');
  });

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!secure) return;
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline or unsupported; app still works */ });

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;
      toast('工日记已更新', {
        actionLabel: '刷新',
        duration: 10000,
        onAction: () => {
          if (db.onboarded && state.view === 'record' && isDirty()) {
            toast('当前还有未保存的勾选，保存后再刷新');
            return;
          }
          location.reload();
        }
      });
    });
  }

  /* ---------------- Init ---------------- */
  function init() {
    setupViewportMetrics();
    loadPrefs();
    applyTheme();
    loadDB();
    if (db.onboarded) initFormState();
    render();
    registerServiceWorker();
    if (loadFailed) {
      setTimeout(() => toast('数据读取失败，已用空数据打开；请到设置里尝试恢复自动备份', { duration: 8000 }), 500);
    }
    if (!storageOK) {
      setTimeout(() => toast('当前浏览器不允许本地保存，请关闭无痕模式或换浏览器', { duration: 9000 }), 700);
    }
    setInterval(maybeRollover, 60000);
  }

  init();
})();
  