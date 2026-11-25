# Legal Lab — VCE Legal Studies Units 3 & 4

A daily practice app: spaced review first, then one new mastery-gated lesson, plus optional extra practice.

## Files (all at the TOP level of the repository — no folders)
index.html · app.js · lessons.js · sw.js · manifest.json · icon-192.png · icon-512.png · README.md

## Updating (how phones update)
1. Edit or add lessons in `lessons.js`.
2. Bump `CONTENT_VERSION` in `lessons.js` and `CACHE` in `sw.js` (keep them matching).
3. Upload the changed files to the repository root, replacing the old ones.
Progress is never reset. If a lesson a student has already mastered gains new questions,
those questions are added to the student's review queue automatically.

## Golden rule
Never change or reuse an existing item `id` for a different question. Review schedules are tied to them.
Lesson `id`s must never change either — mastery is tied to them.
