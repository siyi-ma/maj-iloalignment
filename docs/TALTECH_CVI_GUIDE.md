# TalTech Corporate Visual Identity (CVI) Guide

## Color Palette

### Primary Colors

| Color Name | PANTONE | CMYK | RGB | HEX |
|------------|---------|------|-----|-----|
| **KIRSIPUNANE (TT BURGUNDY)** | PANTONE® 220 C | C23 M100 Y35 K34 | R171 G19 B82 | #aa1352 |
| **FUKSIAPUNANE (TT MAGENTA)** | PANTONE® 213 C | C0 M100 Y0 K0 | R228 G6 B126 | #e4067e |

### Secondary Colors

| Color Name | PANTONE | CMYK | RGB | HEX |
|------------|---------|------|-----|-----|
| **HELESININE (TT LIGHT BLUE)** | PANTONE® 631 C | C64 M0 Y18 K0 | R79 G191 B211 | #4dbed2 |
| **TUMESININE (TT DARK BLUE)** | PANTONE® 274 C | C95 M95 Y30 K20 | R51 G43 B96 | #342b60 |

### Neutral Colors

| Color Name | PANTONE | CMYK | RGB | HEX |
|------------|---------|------|-----|-----|
| **TERASHALL (TT GREY 1)** | PANTONE® 7544 C | C49 M39 Y21 K0 | R147 G150 B176 | #9396b0 |
| **HELEHALL (TT GREY 2)** | PANTONE® 5305 C | C17 M13 Y0 K0 | R218 G218 B228 | #dadae4 |
| **MUST (TT BLACK)** | PANTONE® BLACK C | C0 M0 Y0 K100 | R0 G0 B0 | #000000 |
| **VALGE (TT WHITE)** | N/A | C0 M0 Y0 K0 | R255 G255 B255 | #FFFFFF |

## Color Usage Guidelines

### Color Palette Ratios
- **Primary Dominance**: TT Burgundy and TT Magenta should dominate (60% combined)
- **Recommended Split**: 40/20/20/20%
- **White Usage**: Use white generously as an important part of the palette
- **Consistency**: Maintain the same vivid appearance across screen and print applications

### Cultural Heritage
Color plays an important role in defining TalTech's brand identity and reflecting cultural history and heritage. Consistency in color application is crucial for maintaining brand recognition.

## Typography

### Brand Font: Proxima Nova
- **Primary Font**: Proxima Nova
- **Characteristics**: Combines geometric appearance with modern proportion
- **Benefits**: Easy accessibility and maximum legibility across all applications
- **Weights**: Three main weights with fairly tight spacing

### Font Hierarchy
- **Headlines & Sub-headers**: ALL CAPITALS
- **Body Copy**: Sentence case
- **Leading**: Set at -10% of the headline size for all titles

### Fallback Fonts
- **Microsoft Office**: Verdana Bold or Regular
- **Publications**: Century Schoolbook for body text (with Proxima Nova for supporting elements)

## CSS Variables Implementation

```css
:root {
    /* Primary Colors */
    --tt-burgundy: #aa1352;
    --tt-magenta: #e4067e;
    
    /* Secondary Colors */
    --tt-light-blue: #4dbed2;
    --tt-dark-blue: #342b60;
    
    /* Neutral Colors */
    --tt-grey-1: #9396b0;
    --tt-grey-2: #dadae4;
    --tt-black: #000000;
    --tt-white: #ffffff;
    
    /* Typography */
    --font-primary: 'Proxima Nova', 'Verdana', sans-serif;
    --font-fallback: 'Verdana', sans-serif;
}
```

## Brand Guidelines Summary

1. **Color Dominance**: TT Burgundy and TT Magenta must be the dominant colors
2. **Typography**: Proxima Nova for all text, with specific casing rules
3. **White Space**: Use white generously throughout designs
4. **Consistency**: Maintain consistent application across all platforms
5. **Cultural Identity**: Colors reflect TalTech's cultural heritage and should be respected
6. **Accessibility**: Ensure maximum legibility across all applications

## Implementation Notes

- All color values are tested for consistency between CMYK and Pantone
- Screen colors should match print colors as closely as possible
- Extended color palette can be used but primary colors must dominate
- Leading should be set at -10% of headline size for optimal readability
