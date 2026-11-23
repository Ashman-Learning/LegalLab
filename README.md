# Legal Lab — VCE Legal Studies Units 3 & 4

A daily practice app: spaced review first, then one new mastery-gated lesson.

## Files (all at the TOP level of the repository — no folders)
index.html · app.js · lessons.js · sw.js · manifest.json · icon-192.png · icon-512.png · README.md

## First upload (GitHub Pages)
1. Create a new repository (e.g. `legal-lab`).
2. Upload all files directly into the repository root (not inside a folder).
3. Settings → Pages → Source: Deploy from branch → `main` / `(root)` → Save.
4. The app appears at `https://<your-account>.github.io/legal-lab/` within a minute or two.
5. On a phone: open the link → Share/menu → "Add to Home Screen".

## Adding lessons later (how phones update)
1. Add new lesson objects to the end of `LESSONS` in `lessons.js`.
2. In `lessons.js`, bump `CONTENT_VERSION` (e.g. 1.0.0 → 1.1.0).
3. In `sw.js`, bump `CACHE` to match (e.g. `legal-lab-v1.1.0`).
4. Upload the changed files (replace the old ones).
Phones fetch the new version next time the app is opened online and show "New lessons available".
Student progress is kept.

## Golden rule
Never change or reuse an existing item `id`. Review schedules are tied to them.
To hide a lesson until it's taught, add `released:false`.

## Settings (top of app.js)
- `mastery` — proportion needed on the lesson check (default 0.8)
- `reviewCap` — max review items per day (default 20)
- `intervals` — spacing in days (default 1, 3, 7, 14, 30, 60)
- `aiEndpoint` — reserved for future AI marking of short answers (`type:'short'` items). Leave `null`.

## Lesson structure (per lesson)
Key terms (pre-training) → Learn cards (rule, examples AND non-examples, diagrams) →
Worked example (steps revealed one at a time) → Completion problem (steps given, student finishes) →
Practice (hints allowed, misses recycled) → Mastery check (no hints; pass to unlock next lesson).
Mastered items join the spaced review queue, interleaved across topics.

## Privacy
Progress is stored in the browser on the device only (no accounts, no server). Students can back up and restore with a code.
