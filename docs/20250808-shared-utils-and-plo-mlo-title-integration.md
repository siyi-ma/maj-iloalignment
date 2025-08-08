
# 20250808-shared-utils-and-plo-mlo-title-integration

## Summary

### Main Theme
Shared UI utilities for floating navigation buttons and programme title/subtitle display, integrated across analysis pages (PLO-MLO, CLO-MLO, AI Assistant, Methodology).

---

## Repeated Errors, Reasons, Solutions, and Takeaways

### Error: ReferenceError: displayPloMloPageTitle is not defined
- **Where:** `plo-mlo.html` initialization
- **Why:** Missing `<script src="js/shared-utils.js">` in HTML
- **Solution:** Added shared-utils.js script to HTML
- **Takeaway:** Always include shared utility scripts before using their functions

### Error: Inconsistent programme title/subtitle formatting
- **Where:** Programme header in analysis pages
- **Why:** Duplicated/fragmented logic
- **Solution:** Centralized logic in `shared-utils.js` and integrated into controllers
- **Takeaway:** Use shared utilities for repeated UI logic

---

## Important Code Snippets

### Floating Navigation Buttons (shared-utils.js)
```javascript
function injectFloatingNavButtons() {
    // Home button
    if (!document.getElementById('home-btn-float')) {
        const homeBtn = document.createElement('button');
        homeBtn.id = 'home-btn-float';
        homeBtn.className = 'floating-btn home-btn-float';
        homeBtn.title = 'Go to Home';
        homeBtn.innerHTML = '<i class="fas fa-home"></i>';
        homeBtn.style.position = 'fixed';
        homeBtn.style.bottom = '32px';
        homeBtn.style.right = '32px';
        homeBtn.style.zIndex = '1000';
        document.body.appendChild(homeBtn);
        homeBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
    // Back-to-top button
    if (!document.getElementById('back-to-top')) {
        const topBtn = document.createElement('button');
        topBtn.id = 'back-to-top';
        topBtn.className = 'floating-btn back-to-top';
        topBtn.title = 'Back to top';
        topBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        topBtn.style.position = 'fixed';
        topBtn.style.bottom = '80px';
        topBtn.style.right = '32px';
        topBtn.style.zIndex = '1000';
        document.body.appendChild(topBtn);
        topBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}
```

### Programme Title and Subtitle Utility (shared-utils.js)
```javascript
function displayPloMloPageTitle(code, kavanimetusek, kavanimetusik, titleId, subtitleId) {
    const titleEl = document.getElementById(titleId);
    const subtitleEl = document.getElementById(subtitleId);
    if (titleEl) {
        const codeStr = (code || '').toUpperCase();
        titleEl.textContent = codeStr + (kavanimetusek ? ' ' + kavanimetusek : '');
    }
    if (subtitleEl) {
        subtitleEl.textContent = (kavanimetusik ? kavanimetusik + ' – ' : '') + 'PLO-MLO Alignment Analysis';
    }
}
```

### Integration Example (plo-mlo.html)
```javascript
// In updateHeader()
displayPloMloPageTitle(kavakood, kavanimetusek, kavanimetusik, 'page-title', 'page-subtitle');
```

### Script Inclusion (plo-mlo.html)
```html
<script src="js/shared-utils.js"></script>
```

---

## Relevant Command Line Actions
```
git add .
```

---

## Honest, Factual Process Summary
- **When:** August 8, 2025
- **Where:** maj-iloalignment workspace
- **What happened:** Refactored floating navigation buttons and programme title/subtitle display into shared utility file. Integrated utilities into analysis pages. Fixed ReferenceError by including shared-utils.js. Improved UI consistency and maintainability.
- **Resolution:** All issues resolved. Shared utilities are integrated and available. No unresolved errors. Ready for further extension if needed.
