# Score Color Standardization Guide

## Overview
This document outlines the standardized color system used across all TalTech ILO Alignment Analysis HTML files to ensure consistent visual presentation of alignment scores.

## Color Scheme Implementation

### Primary Colors (Simplified TalTech CVI)
- **Primary**: `#aa1352` (TalTech Burgundy)
- **Secondary**: `#342b60` (TalTech Dark Blue)
- **Light Grey**: `#f8f9fa` (Backgrounds)
- **Medium Grey**: `#e9ecef` (Secondary backgrounds)

### Standardized Score Colors
| Score Range | Color Name | Hex Code | Usage |
|-------------|------------|----------|-------|
| 1.0-1.4 | Poor | `#dc3545` | Red - Fundamental issues |
| 1.5-2.4 | Weak | `#fd7e14` | Orange - Significant gaps |
| 2.5-3.4 | Moderate | `#ffc107` | Yellow - Targeted improvements |
| 3.5-4.4 | Good | `#28a745` | Green - Minor adjustments |
| 4.5-5.0 | Excellent | `#007bff` | Blue - Optimal alignment |

## Implementation Files

### CSS File
- **Location**: `css/score-colors.css`
- **Purpose**: Centralized color definitions and classes
- **Usage**: Include in all HTML files for consistent styling

### CSS Classes Available
```css
/* Background + text colors */
.score-1, .score-2, .score-3, .score-4, .score-5

/* Legend colors */
.legend-score-1, .legend-score-2, .legend-score-3, .legend-score-4, .legend-score-5

/* Text-only colors */
.text-score-poor, .text-score-weak, .text-score-moderate, .text-score-good, .text-score-excellent

/* Badge styles */
.score-badge-1, .score-badge-2, .score-badge-3, .score-badge-4, .score-badge-5

/* Progress bars */
.progress-bar-poor, .progress-bar-weak, .progress-bar-moderate, .progress-bar-good, .progress-bar-excellent
```

## HTML Files Updated

### Current Implementation
- ✅ `methodology.html` - Updated with simplified color scheme and examples
- 🔄 `plo-mlo.html` - Needs update to use standardized colors
- 🔄 `clo-mlo.html` - Needs update to use standardized colors
- 🔄 Other HTML files - Pending review and update

### Changes Made to methodology.html
1. **Simplified Color Palette**: Reduced from 8 colors to 2 primary colors
2. **Standardized Score Colors**: Implemented consistent 5-level color system
3. **Added Programme Examples**: Included MAJB and MAKM examples alongside TVTB
4. **Enhanced Examples**: Each analysis component now shows multiple programme examples
5. **Improved Visual Design**: Cleaner, more professional appearance

## Programme Examples Added

### TVTB (International Business Administration)
- Semantic Analysis: PLO "Synthesizes wide-ranging knowledge" + MLO "Analyses international business"
- Competency Analysis: Combined business and analytical competencies
- Cognitive Analysis: Create(6) → Analyze(4) progression
- Full calculation example with step-by-step breakdown

### MAJB (Sustainable Entrepreneurship and Circular Economy)  
- Semantic Analysis: PLO "Designs sustainable business models" + MLO "Knows circular economy principles"
- Cognitive Analysis: Create(6) → Remember(1) - demonstrating large gap scenario
- Poor alignment example (Score: 1.8) with detailed suggestions

### MAKM (Sustainability Management)
- Competency Analysis: Strong management and sustainability focus
- Contextual Analysis: Excellent domain alignment with ESG principles
- Moderate alignment example (Score: 3.2) showing improvement areas

## Benefits of Standardization

1. **Consistency**: Same colors mean the same thing across all interfaces
2. **User Experience**: Reduces cognitive load and improves recognition
3. **Accessibility**: Carefully chosen colors with sufficient contrast
4. **Maintainability**: Centralized CSS makes updates easier
5. **Professional Appearance**: Clean, academic-appropriate design

## Next Steps

1. Update `plo-mlo.html` to use standardized score colors
2. Update `clo-mlo.html` to use standardized score colors  
3. Review and update any other HTML files with score displays
4. Test color accessibility and contrast ratios
5. Document color usage in component guidelines

## Usage Instructions

### For Developers
```html
<!-- Include the standardized CSS -->
<link rel="stylesheet" href="css/score-colors.css">

<!-- Use standardized classes -->
<div class="score-4">Good alignment score</div>
<span class="text-score-excellent">Excellent result</span>
<span class="score-badge-3">3.2</span>
```

### For Designers
- Always use the defined color variables
- Maintain consistency across all score-related elements
- Follow the TalTech CVI guidelines for typography and spacing
- Ensure sufficient contrast for accessibility

---

**Version**: 1.0  
**Date**: August 5, 2025  
**Author**: Siyi Ma  
**Status**: Implemented in methodology.html, pending in other files
