# Product Requirement Document: Org Security Checkup

## App Name
**SafeBase**

## One-Line Summary
A self-service security assessment tool that helps small nonprofits understand where they are vulnerable and what to fix first, in plain language, without needing a tech background.

## The Problem

4 out of 5 nonprofits have no cybersecurity plan. 9 out of 10 do not train staff regularly on cybersecurity. 71% allow staff to use unsecured personal devices to access organizational email and files. 60% have experienced a cyberattack in the last two years. And breaches take an average of 467 days to discover.

The average cost of a data breach for a nonprofit is up to $2 million. For a small rural org running on a $300,000 annual budget, that is not a setback. That is the end.

Everyone knows this is a problem. But 60% of nonprofit leaders cite cost as their primary barrier to improving technology infrastructure. So cybersecurity keeps getting pushed to the bottom of the list. Not because it does not matter, but because there is no money, no staff, and no clear starting point.

Most security tools on the market are built for enterprises. They assume a dedicated IT team, a budget for software licenses, and staff who know what "MFA" and "endpoint protection" mean. Small nonprofits do not have any of that. They need someone to meet them where they are and tell them, in plain English, what to do first.

## Who This Is For

- Executive directors of nonprofits with 2 to 30 staff who know their security is weak but do not know how weak or where to start
- Office managers who are also the unofficial IT person because nobody else volunteered
- Board members who keep asking "are we protected?" and never get a clear answer
- Small mission-driven businesses that handle sensitive data (client records, donor information, financial data) without formal protections
- Rural organizations with no access to local IT consultants or managed service providers

## Core Features

1. **Guided assessment.** The user answers questions in plain language about how their organization operates. How do people log in? Who has access to what? Do you back up your data? Where do you store passwords? The questions are organized by topic, not by technical category.

2. **Scored report.** Based on the answers, the tool generates a security score with a breakdown by area: passwords and access, devices, data storage, backups, email, and staff practices. Color-coded. Simple.

3. **Prioritized recommendations.** The report does not just say "you have a problem." It says "here are the three things to fix first, here is why, and here is how." Recommendations are ranked by risk level and ease of implementation. The easiest, most impactful fixes come first.

4. **Action cards.** Each recommendation comes as a standalone action card with a clear description, estimated time to complete, estimated cost (including free options), and step-by-step instructions. No jargon. Written for people who are not technical.

5. **Progress tracking.** The user can mark recommendations as complete, in progress, or skipped. The score updates as they work through the list. Gives them a sense of momentum and a record of improvement.

6. **Exportable report.** Download the full assessment as a PDF. Useful for board presentations, grant applications that ask about data protection, and insurance renewals that increasingly require evidence of basic security practices.

7. **Reassessment on a schedule.** The tool prompts users to retake the assessment every 6 months. Security is not a one-time thing. The tool should reinforce that.

## What It Does NOT Do

- It does not scan your network or test your systems. This is a self-reported assessment, not a penetration test. It tells you what to improve based on what you tell it. It does not find hidden vulnerabilities.
- It does not replace a managed security provider. For organizations with complex infrastructure or compliance requirements (like HIPAA), this tool is a starting point, not a solution.
- It does not store your passwords or sensitive credentials. The tool asks about your practices. It never asks for your actual passwords, access keys, or confidential data.

## Why This Matters

The organizations doing the most important work in their communities are the most exposed. Food banks. Domestic violence shelters. Youth programs. They handle deeply sensitive data every day. Client names, addresses, case notes, financial records. And most of them are one phishing email away from a breach they cannot recover from.

This is not about scaring people. It is about giving them a clear picture of where they stand and a realistic path to getting better. No $50,000 security contract. No 200-page compliance framework. Just an honest checkup with honest next steps.

This connects directly to the organizational hygiene work I already do. Password management, access controls, document systems. SafeBase takes that same approach and gives organizations a way to start the work on their own, before they bring in a consultant. And for many of them, the tool itself will be enough.

## Estimated Build Scope

**Light to medium.** The core is a questionnaire and a scoring algorithm. No integrations with external systems. The complexity is in the content: writing good questions, building a fair scoring model, and producing recommendations that are genuinely useful and specific. The tech is straightforward. The expertise is in the subject matter.

## Revenue Model

- **Free tier.** Let users take the assessment and see their overall score and top three risks. Enough to be useful and to show the value of the full report.
- **Paid report. $29 to $59 one-time.** Full scored report with all recommendations, action cards, and exportable PDF.
- **Annual subscription. $49/year.** Includes reassessments, updated recommendations as best practices change, and progress tracking over time.
- **Consulting bridge.** For orgs that see their report and realize they need hands-on help, offer a clear path to book a session. "Your report flagged access controls as your top risk. Book a 90-minute session to get it sorted." Direct, specific, and tied to their actual results.
- **Group licensing.** Offer to state associations, community foundations, or networks that want to provide the tool to their member organizations. $20 to $40 per org at volume.
