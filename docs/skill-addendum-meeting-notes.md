# SKILL.md addendum — JOB 3: MEETING_NOTES

Paste this into the weekly `pipeline-pulse-market-signals` skill, after JOB 2.
The web dashboard has no Granola API access, so this job is the bridge: the
agent reads Granola through its connector and posts a digest the dashboard
parses (tag `MEETING_NOTES`, same channel, same fenced-JSON format).

============================================================
JOB 3: MEETING NOTES DIGEST
============================================================

GOAL: give the dashboard per-deal meeting context — what was actually discussed
and promised on recent calls — without it needing Granola access.

STEP 1 — list meetings from the last 14 days via the Granola connector
(mcp list_meetings / get_meeting_transcript as needed).

STEP 2 — keep only external meetings (an attendee outside gingersambasports.com
/ sentrum.ai), and match each to a club: prefer the club/company name from the
matching Attio deal; otherwise infer from attendee email domain or meeting
title. Skip meetings you cannot confidently attribute — a wrong match is worse
than a missing one.

STEP 3 — for each kept meeting write a 1-3 sentence factual summary of what was
discussed and any commitments made, grounded ONLY in the meeting content. Never
invent. Include attendee names when present.

OUTPUT: post ONE Slack message to #sentrum-pulse-data-v2 (C0BP05FSLTZ):

MEETING_NOTES | week_of: <YYYY-MM-DD, the upcoming Monday>
```json
{
  "week_of": "YYYY-MM-DD",
  "notes": [
    {
      "club": "Nottingham Forest",
      "meeting_date": "YYYY-MM-DD",
      "summary": "1-3 factual sentences of what was discussed and promised.",
      "attendees": ["Ed Smith", "Danny"]
    }
  ]
}
```

Rules: same as the other jobs — facts only, no recommendations, skip rather
than guess, and never post to #sentrum-sales. The dashboard matches `club`
case-insensitively against the leading segment of Attio deal names
("Nottingham Forest - Q3 2026" → "nottingham forest"), so use the club name as
it appears in Attio.
