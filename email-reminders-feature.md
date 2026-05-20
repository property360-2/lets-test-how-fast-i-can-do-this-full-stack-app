# OJT Journal Email Reminders & Missing Submissions Tracker

## Goal
Enable administrators to identify students with missing daily journals and send personalized email reminders securely via zero-config `mailto:` links.

## Tasks
- [ ] **Task 1: Add a "Missing Journals" Column & Filter in `admin-students.html`** → Verify: Load `admin-students.html`, verify that students with missing journals show a badge with their count and are filterable.
- [ ] **Task 2: Build email helper utility in `system-script/ui-utils.js`** → Verify: A helper function formats a professional email body listing the exact dates the student has missed.
- [ ] **Task 3: Integrate Native `mailto:` Quick-Reminder Action in Student List** → Verify: Click the envelope icon next to a student; verify that your default email app opens with correct email, subject, and body.
- [ ] **Task 4: Add hover micro-animations & user feedback** → Verify: Tooltips and success toast appear when initiating the email reminder.

## Done When
- [ ] Admin dashboard and student table show students with missing journals.
- [ ] Admins can click a reminder button to automatically draft and open native email reminders listing missing dates.
