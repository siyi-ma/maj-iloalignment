# In-house Methodology for Outcome Alignment Analysis

This document describes the in-house (TalTech SBG) methodology for analyzing alignment between Programme Learning Outcomes (PLOs), Module Learning Outcomes (MLOs), and Course Learning Outcomes (CLOs) in higher education.

## Overview
The in-house methodology is based on the TalTech School of Business and Governance (Majandusteaduskond) Enhanced ILO Alignment Analysis Methodology v1.0. It provides a transparent, step-by-step framework for evaluating outcome alignment using semantic, competency, cognitive, contextual, and progression analyses.

## Methodology Steps

### 1. Semantic Analysis (35%)
- Extract meaningful words (3+ chars, no stop words) from each PLO and MLO separately.
- Calculate exact overlap percentage for each PLO-MLO pair: `(shared words / PLO words) × 100`.
- Normalize: `min(5.0, overlapPercentage / 4.0)`.
- Show calculation: "X shared words / Y total PLO words = Z% overlap → normalized score".

### 2. Competency Analysis (25%)
- Map words to EQF competency categories (analytical, creative, application, etc.).
- Apply category weights: analytical(1.3), creative(1.4), application(1.1), etc.
- Calculate: `(matched keywords / total keywords) × category weight`.
- Normalize: `min(5.0, totalWeight × 1.5)`.
- Present results in a table: 'Category', 'Matched Keywords', 'Total Keywords', 'Category Weight', 'Score'.

### 3. Cognitive Analysis (20%)
- Identify Bloom's Taxonomy levels: Remember(1), Understand(2), Apply(3), Analyze(4), Evaluate(5), Create(6).
- Calculate level gap: `|PLO_level - MLO_level|`.
- Check progression: `MLO_level ≤ PLO_level`.
- Score: progressive ? `(1.0 - gap × 0.2)` : `0.3`.
- Normalize: `score × 5.0`.

### 4. Contextual Analysis (15%)
- Identify domain-specific terms for the programme.
- Apply domain relevance multipliers.
- Calculate total relevance score.
- Normalize: `min(5.0, relevanceScore)`.

### 5. Progression Analysis (5%)
- Assess sequential building patterns.
- Consider module prerequisites and year level.
- Calculate building score (0-1.0).
- Normalize: `buildingScore × 5.0`.

### Final Calculation
`Final Score = (semantic×0.35) + (competency×0.25) + (cognitive×0.20) + (contextual×0.15) + (progression×0.05)`

## Output Format
- Use `<h2>` for the main report title.
- Use `<h3>` for section titles.
- For tables, use HTML with clear headers and cell borders.
- Show all mathematical work for transparency.

## Quality Assurance
- All scores must be 1.0-5.0 range.
- Base analysis on established frameworks (EQF, Bloom's Taxonomy).
- Provide actionable improvement suggestions.

## Reference
TalTech SBG (Majandusteaduskond) ILO Alignment Analysis Methodology v1.0

---
For more details, see [methodology.html](../methodology.html).
