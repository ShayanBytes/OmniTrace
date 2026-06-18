/**
 * demoData.js
 * -----------
 * Sample data so the whole UI (masonry grid, 3D cards, filters, report
 * modal) can be exercised WITHOUT the backend or any AI model running.
 *
 * Triggered by the "Load demo data" button on the empty state. In demo
 * mode, analyzing a file returns a canned report after a short delay
 * instead of hitting /api/analyze.
 */

export const DEMO_OVERVIEW = {
  total_commits: 1284,
  total_files: 326,
  contributors: 11,
  active_branch: "main",
  last_commit_date: "2026-05-30T14:12:00+00:00",
};

// Varied days_idle + complexity so risk colors and card heights differ.
export const DEMO_GRAVEYARD = [
  {
    path: "src/legacy/payments/gateway_v1.py",
    last_commit: "2022-01-14T09:30:00+00:00",
    days_idle: 1586,
    author: "Dana Lee",
    message: "Patch rounding bug in currency conversion",
    avg_complexity: 9.4,
    max_complexity: 27,
    function_count: 18,
    nloc: 612,
    analyzed: true,
  },
  {
    path: "src/auth/session_manager.js",
    last_commit: "2023-03-02T18:05:00+00:00",
    days_idle: 1204,
    author: "Priya Nair",
    message: "Refactor token refresh flow",
    avg_complexity: 6.1,
    max_complexity: 14,
    function_count: 9,
    nloc: 248,
    analyzed: true,
  },
  {
    path: "scripts/migrate_old_db.rb",
    last_commit: "2021-11-08T11:45:00+00:00",
    days_idle: 1653,
    author: "Marco Rossi",
    message: "One-off migration for v2 schema",
    avg_complexity: 4.2,
    max_complexity: 8,
    function_count: 5,
    nloc: 132,
    analyzed: true,
  },
  {
    path: "src/utils/date_helpers.ts",
    last_commit: "2024-08-19T07:20:00+00:00",
    days_idle: 668,
    author: "Sam Okafor",
    message: "Add ISO week helpers",
    avg_complexity: 2.3,
    max_complexity: 5,
    function_count: 7,
    nloc: 96,
    analyzed: true,
  },
  {
    path: "docs/architecture/old-design.md",
    last_commit: "2022-06-30T16:00:00+00:00",
    days_idle: 1448,
    author: "Dana Lee",
    message: "Document the v1 microservice split",
    avg_complexity: 0,
    max_complexity: 0,
    function_count: 0,
    nloc: 0,
    analyzed: false,
  },
  {
    path: "src/reports/pdf_exporter.java",
    last_commit: "2023-09-12T13:10:00+00:00",
    days_idle: 1010,
    author: "Wei Chen",
    message: "Fix font embedding on Windows",
    avg_complexity: 11.8,
    max_complexity: 33,
    function_count: 22,
    nloc: 744,
    analyzed: true,
  },
  {
    path: "src/ui/widgets/Carousel.jsx",
    last_commit: "2024-12-01T10:00:00+00:00",
    days_idle: 564,
    author: "Priya Nair",
    message: "Pause autoplay on hover",
    avg_complexity: 3.5,
    max_complexity: 7,
    function_count: 6,
    nloc: 178,
    analyzed: true,
  },
  {
    path: "src/search/indexer.go",
    last_commit: "2023-02-17T22:30:00+00:00",
    days_idle: 1217,
    author: "Marco Rossi",
    message: "Throttle reindex on bulk import",
    avg_complexity: 8.9,
    max_complexity: 19,
    function_count: 14,
    nloc: 488,
    analyzed: true,
  },
  {
    path: "src/notifications/email_templates.py",
    last_commit: "2024-04-05T08:15:00+00:00",
    days_idle: 804,
    author: "Sam Okafor",
    message: "Tweak welcome email copy",
    avg_complexity: 1.6,
    max_complexity: 4,
    function_count: 11,
    nloc: 220,
    analyzed: true,
  },
  {
    path: "src/legacy/cron/cleanup.sh",
    last_commit: "2021-07-21T04:00:00+00:00",
    days_idle: 1763,
    author: "Wei Chen",
    message: "Nightly temp-file cleanup",
    avg_complexity: 0,
    max_complexity: 0,
    function_count: 0,
    nloc: 0,
    analyzed: false,
  },
  {
    path: "src/api/v1/users_controller.rb",
    last_commit: "2023-05-29T15:40:00+00:00",
    days_idle: 1116,
    author: "Dana Lee",
    message: "Deprecate /users/bulk endpoint",
    avg_complexity: 7.7,
    max_complexity: 16,
    function_count: 13,
    nloc: 402,
    analyzed: true,
  },
  {
    path: "src/ui/theme/colors.ts",
    last_commit: "2025-02-10T12:00:00+00:00",
    days_idle: 128,
    author: "Priya Nair",
    message: "Add high-contrast palette",
    avg_complexity: 1.1,
    max_complexity: 2,
    function_count: 3,
    nloc: 64,
    analyzed: true,
  },
];

/** A plausible canned report so the report modal can be previewed offline. */
export function demoReport(file) {
  return {
    ok: true,
    report:
      `This file (\`${file.path}\`) exists to handle a focused slice of the ` +
      `system's behaviour, and it has drifted out of active maintenance — it ` +
      `has sat untouched for about ${file.days_idle} days. The most recent ` +
      `meaningful change was "${file.message}", which suggests the last work ` +
      `here was a targeted fix rather than a redesign. For a junior developer: ` +
      `treat it as load-bearing-but-fragile — read it fully and add tests ` +
      `before changing anything, especially given its complexity hotspots.`,
    commit_messages: [
      file.message,
      "Bump dependencies",
      "Add logging around edge cases",
      "Initial extraction from monolith",
      "Wire up to CI",
    ],
    code:
      `// (demo source preview for ${file.path})\n` +
      `// Real source is loaded from disk when the backend is running.\n\n` +
      `function example() {\n  return "OmniTrace demo mode";\n}\n`,
  };
}
