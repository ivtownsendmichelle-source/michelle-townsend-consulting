# Product Requirement Document: Systems Inventory and Migration Planner

## App Name
**ToolMap**

## One-Line Summary
A tool that helps small organizations catalog every system they use, see what is costing them, and build a prioritized plan for what to keep, replace, or retire.

## The Problem

Nearly half of nonprofits still rely on manual data entry and spreadsheets for core operations. Compliance documentation, meeting summaries, case notes, donor tracking. It all lives in disconnected systems that do not talk to each other. Donor databases in one place. Financials in another. Program data in a spreadsheet that one person maintains and nobody else understands.

Technology maturity in nonprofits consistently lags behind other sectors. And 60% of nonprofit leaders say budget is the top obstacle to improving their tech. But the deeper problem is not money. It is capacity. These organizations do not have staff who can evaluate what to replace, plan a migration, or train a team on a new system.

So nothing changes. They stay on the old platform because switching feels overwhelming. They pay for three tools that do overlapping things because nobody has mapped it out. They lose institutional knowledge every time a staff member leaves because the systems were never documented.

The result is wasted money, wasted time, and real limits on what the organization can report to funders, deliver to clients, and sustain over the long term.

## Who This Is For

- Executive directors who suspect they are paying for tools nobody uses but have no way to confirm it
- Operations staff who inherited a patchwork of systems from three predecessors and need to make sense of it
- Board treasurers who see line items for software subscriptions and cannot get a straight answer about what each one does
- Small nonprofits going through a leadership transition and trying to document what the outgoing director kept in their head
- Rural organizations that cannot hire a systems consultant and need a structured way to think through their tech stack on their own

## Core Features

1. **Guided inventory builder.** The user walks through their organization by function: communications, donor management, finances, program delivery, file storage, HR, compliance. For each function, they list the tools they use, who uses them, what they cost, and whether the tool is critical, useful, or unused. The tool prompts with common examples so users do not forget things they take for granted (like Google Drive or their email platform).

2. **Visual systems map.** Once the inventory is complete, the tool generates a visual map showing every system, which functions it serves, and where there are overlaps or gaps. If two tools do the same thing, it is obvious. If a critical function has no tool at all, that shows up too.

3. **Cost summary.** A clear breakdown of what the organization spends on software and subscriptions. Monthly total, annual total, and cost per tool. Includes both paid subscriptions and estimated staff time costs for manual processes. Helps answer the question: "What is this actually costing us?"

4. **Gap and overlap analysis.** The tool flags situations that need attention. Two tools doing the same job. A function with no tool at all. A system that only one person knows how to use. A paid tool with a free alternative that would work just as well.

5. **Migration priority ranking.** Based on the inventory, the tool generates a ranked list of recommended changes. What to replace first, what to consolidate, and what to leave alone. Each recommendation includes a rough budget estimate, a difficulty rating (easy, moderate, hard), and a suggested timeline.

6. **Exportable migration plan.** The user can download a clean, formatted migration plan as a PDF or Word document. Useful for board presentations, grant applications, strategic planning sessions, or handing to a consultant if they decide to bring one in.

7. **Transition checklist.** For each recommended migration, the tool generates a basic checklist: data backup, account setup, data transfer, staff training, old system shutdown. Not a full project plan, but enough structure to keep things from falling through the cracks.

## What It Does NOT Do

- It does not migrate your data. It helps you plan the migration. The actual work of moving data from one system to another still requires a person (or a consultant).
- It does not recommend specific products by brand. It identifies what kind of tool you need for each function and what features to look for. It does not say "switch to Salesforce." It says "you need a donor management system that does X, Y, and Z, and here is what to budget for it."
- It does not connect to your existing accounts or access your data. Everything is self-reported. The tool never asks for login credentials or API access.

## Why This Matters

Small nonprofits are stuck in a cycle. They cannot improve because they do not know what they have. They do not know what they have because nobody has time to catalog it. And nobody has time because the existing systems are so inefficient that all the hours go to workarounds and manual processes.

ToolMap breaks the cycle by giving organizations a structured way to see the full picture. What they use. What it costs. What they should change. And in what order.

This is work I do in consulting engagements every week. I sit down with an executive director and we map out their systems, identify the waste, and build a plan. ToolMap takes the first phase of that process and puts it in a format that any organization can use on their own. For some orgs, that will be enough. For others, it is the starting point for a deeper engagement. Either way, they end up with clarity they did not have before.

Nonprofits do not need enterprise solutions. They need someone who understands their workflows and can help them build or choose the right tools at the right scale. That is the gap. ToolMap helps close it.

## Estimated Build Scope

**Medium.** The inventory questionnaire and logic are moderately complex because the tool needs to handle a wide variety of organizational structures and tech stacks. The visual systems map requires some design work but nothing exotic. The migration planning logic is the heaviest lift because it needs to produce recommendations that are actually useful, not generic. Content and subject matter expertise matter more than engineering complexity here.

## Revenue Model

- **Free tier.** Let users complete the inventory and see a basic summary: total tools, total cost, and top three overlaps or gaps. Enough to prove the value and get them thinking.
- **Paid report. $59 to $99 one-time.** Full visual map, cost analysis, gap and overlap report, migration priority list, and exportable plan.
- **Consulting package.** Offer a bundled service: the user completes the inventory in ToolMap, then books a 2-hour consulting session where I walk through the results with them and build out the migration plan in detail. $250 to $400 for the bundle. This is the highest-value offering because it combines the tool's structure with real expertise.
- **Annual reassessment. $39/year.** Organizations change. Staff turn over. New tools get adopted. An annual reassessment keeps the inventory current and catches drift before it becomes a mess again.
- **Group licensing.** Offer to umbrella organizations, funders, or networks that want their grantees or members to document their systems as part of a capacity-building initiative. $35 to $60 per org at volume.
