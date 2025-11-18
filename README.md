## **NeonGoblin — Website**

Landing page for a **fictional indie game studio** with a **neon aesthetic** and **goblin-inspired theme**.

## 🚀 Running Locally

1. Open the project folder in your preferred editor (e.g., VS Code).  
2. Serve the directory using a simple static server, or open `index.html` directly in your browser.  
   Serving over HTTP ensures that external fonts and assets load correctly.

Example using Python (Windows PowerShell):

```powershell
python -m http.server 8000
# Then visit http://localhost:8000
```

## Project Structure

```
.
├── index.html
├── assets
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── script.js
│   └── images
│       └── logo.png
├── README.md
└── LICENSE
```

- `index.html` — Main structure including hero section, featured highlights, filterable game showcase, CTA, and detail modal.
- `assets/css/styles.css` — Responsive layout with animated grids, neon glow effects, and full mobile navigation support.
- `assets/js/script.js` — Handles interactive particles, hamburger menu, scroll spy, dynamic game list rendering, filtering, modals, and form validation.
- `assets/images/logo.png` — Studio logo used in the header and footer.

## Design Notes

- Neon palette based on vibrant greens, blues, and warm orange accents.
- Typography: “Inter” as the primary font, with gradient-styled headings to reinforce the brand identity.
- Accessibility: Visible focus indicators, semantic HTML structure, and ARIA states for interactive components and keyboard navigation.

## Next Steps

- Add individual game pages featuring trailers, screenshots, and development roadmaps.
- Connect the newsletter form to a real mailing service (e.g., Buttondown, Mailchimp).
- Implement language selection and a persistent theme switcher (light/dark mode).
