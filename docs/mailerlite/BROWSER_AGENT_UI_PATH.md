# MailerLite automation — proven UI path

Source: screen recording `Screen Recording 2026-07-17 at 6.58.40 PM.mov` (teaching run with placeholders `name_goes_here` / `value` / `subject here -- do it first`).

Do not skip screens. Do not Activate until subject + body are verified.

---

## A. Create automation

1. **Automations** → **Workflows** → **New automation**
2. Land on **Choose template** (`/automations/create`)
3. Click **Start from scratch** (the big card / Create →) — not a Welcome/Win-back template
4. **Create automation** modal appears:
   - Type exact automation name in **Enter automation name**
   - Click green **Start building →** *inside the modal* (not the Start from scratch card behind the dimmed backdrop)

---

## B. Trigger: Updates field

5. Blank canvas: **Add step** panel → **Triggers** tab
6. Click **Updates field** (places **Updates field 1** on canvas)
7. Right panel **Custom field**:
   - Open **Please select** → choose **`last_trigger`**
   - Operator dropdown defaults may show **contains** — open it and choose **`is equal`** (required; never leave contains)
   - Value box → exact `trigger_name` (e.g. `wellness_assessment_reminder_2`)
   - **Save**
8. Canvas must show: `last_trigger is equal <trigger_name>` with green check

---

## C. Action: Send email

9. Click the small **+** under the trigger node (canvas connector; not zoom +; not left-rail +)
10. **Rules & actions** tab → click **Send email**
11. Right panel **Email 1** — fill **before** designing:
    1. **Subject** first (`Email subject` placeholder) — required
    2. **Email name** (`Name` placeholder)
    3. **Preheader** optional (panel field only — not in the design canvas)
    4. From / sender should already be Her Wellness Harmony / support@…

---

## D. Design email body (Simple editor) — critical

12. Click **Design email**
13. **Email design** chooser → **Simple editor** → continue (not Drag & drop, not Custom HTML)
14. After **Simple editor** opens: **Title (optional)** is empty, but the cursor is already blinking in the **body** field (not in title)
15. Press **Up arrow** to move into the title field
16. Type the title (automation name)
17. Press **Down arrow** to return to the body field
18. Type **`/`**
19. Select **`Text`** (Enter while Text is highlighted, or click Text)
20. **Then** paste the full body inside that Text block
    - Use merge tag `{$name}` (not `{{name}}`)
    - Do **not** paste before Text is selected (huge/bold text)
21. Click green **Next** (top right)
22. Back on workflow Email panel → confirm subject/name still correct → **Save**

---

## E. Activate

23. Canvas shows **Email 1** with name/thumbnail (not empty “Set up email”)
24. Click **Activate** → confirm if prompted
25. Success = Active / Pause button visible; API `enabled: true`

---

## Cleanup rule

- Do **not** delete a draft while its email editor is still open (causes **410 Deleted**)
- Cleanup incomplete drafts only at the **start** of a new run
- Keep **Wellness Assessment Reminder 1**

---

## Placeholder → real values

| Teaching placeholder | Real field |
|---|---|
| `name_goes_here` | `automation_name` |
| `value` | `trigger_name` |
| `name here` | email name (= automation_name) |
| `subject here -- do it first` | `subject` |
| `text here` | email `body` with `{$name}` |
