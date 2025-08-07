# AI Agent Communication Guidelines

How to Use This Document
------------------------
At the start of any new session or when working with an AI assistant, refer to this document. You can:
- Copy the checklist or example session start into your first message.
- Remind the assistant to follow these guidelines if you notice context drift or misunderstandings.
- Share with collaborators to ensure consistent communication standards.

## Purpose
This document serves as a reference and reminder for best practices in communicating with AI assistants during development sessions. Place this at the start of a session or workspace to help ensure clarity and efficiency.

## Guidelines
- **State the Main Topic:** Begin each session by clearly stating the main topic, file(s), or feature(s) you want to focus on.
- **Explicit File References:** When discussing code, always mention the relevant file(s) and, if possible, the function, class, or section.
- **Summaries and Outputs:** Specify if you want a summary, what it should include, and the format you prefer.
- **Context Changes:** When switching topics or files, restate the new focus to avoid context drift.
- **Clarify Ambiguity:** If the assistant's output is off-topic or unclear, immediately clarify or restate your intent.
- **Incremental Changes:** For large refactors, request incremental changes and validations to maintain stability.
- **Code Snippets:** When possible, provide or request code snippets to illustrate your point or desired outcome.
- **Feedback Loop:** Give feedback on outputs—what worked, what didn’t, and what to improve for next time.
- **Sensitive Data:** Never include API keys, passwords, or sensitive information in prompts or code.

## Example Session Start
```
# Session Topic: Score Class Color Legend Refactor
- Focus: Standardizing score color classes in plo-mlo.html and shared.css
- Goal: Implement and document a universal score class utility
- Output: Summary with code snippets and lessons learned
```

## Common Pitfalls for AI Agents
- **Visible Context Drift:** The AI may use visible files, previous session content, or unrelated examples as context, leading to off-topic responses. Always clarify the current focus.
- **Ambiguous Instructions:** Vague or broad prompts can cause the AI to make incorrect assumptions. Be as specific as possible.
- **Template Reuse:** The AI may reuse summary or code templates from unrelated sessions if not given clear new instructions.
- **Overwriting or Missing Details:** Without explicit direction, the AI might omit important details or overwrite relevant content.
- **Sensitive Data Exposure:** If sensitive data is present in the visible context, the AI may inadvertently reference or include it. Always mask or omit such data.

## Benefits
- Reduces misunderstandings and context errors
- Keeps both user and assistant aligned on goals
- Improves quality and relevance of summaries and code changes

---
Feel free to edit or expand this document as your workflow evolves.
