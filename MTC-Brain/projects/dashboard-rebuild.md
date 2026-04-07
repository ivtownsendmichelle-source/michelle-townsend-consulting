# Dashboard Rebuild

## Status: Built

## Location
`MTC-Brain/command-center.html` (open in any browser)

Previous version: `my-dashboard/index.html` (March 18, standalone repo)

## What It Is
Internal command center dashboard for MTC. Single screen, everything at a glance. All data stored in browser localStorage.

## What's On It
- Status bar (active clients, projects, pipeline, team count)
- Daily Planner (4x15min blocks + custom tasks)
- Quick Links (client-facing tools, build tools, daily tools, social)
- Active Clients (add/remove, phase tags, double-click to add notes)
- Active Projects (add/remove, status tags, double-click to add notes)
- Agent Team (Maxwell, Sally, Researcher, Strategist, Marketing with status)
- Weekly Scorecard: Social (messages, calls, posts, practice) + Business (proposals, leads, follow-ups, meetings)
- Follow-ups (upcoming items with dates, overdue flagging)
- Sticky Note (auto-saves)

## Constraints
- No backend. Static HTML file, all localStorage.
- Mobile responsive.
- Same green/gold/cream brand theme.

## Next Steps
- [ ] Populate with real client and project data
- [ ] Update agent team status as agents come online
- [ ] Customize pipeline calculation once pricing is tracked per client
