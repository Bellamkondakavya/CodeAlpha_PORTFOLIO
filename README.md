# Kavya Bellamkonda — Portfolio (Dark Neon)

A modern, fully responsive personal portfolio website built with **HTML + CSS + JavaScript**, featuring:

- Dark gradient theme + glassmorphism/neon accents
- Smooth scrolling + sticky navbar + active section highlight (scrollspy)
- Hero typing animation + subtle particle background
- Animated cards/buttons + scroll reveal animations (AOS)
- Loading screen + scroll-to-top button

## Project Structure

```
.
├─ index.html
├─ style.css
├─ script.js
├─ favicon.svg
└─ assets/
   ├─ images/
   │  ├─ profile-placeholder.svg
   │  ├─ about-visual.svg
   │  ├─ project-food.svg
   │  └─ project-tip.svg
   └─ resume/
      └─ Bellamkonda_Kavya_Resume.pdf
```

## How to Run (Local)

Just open `index.html` in your browser.

If you want a local server (recommended for best behavior):

```bash
# VS Code / Cursor terminal
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Customize (Quick)

- **Social links**: GitHub + LinkedIn + Email + Phone are in `index.html`; update URLs there if they change.
- **Projects**:
  - Update project GitHub + Live Demo links in the Projects section of `index.html`.
  - Replace placeholder images in `assets/images/`.
- **Resume**:
  - Your PDF is linked at `assets/resume/Bellamkonda_Kavya_Resume.pdf`.
  - If you rename it, update the Resume + Hero button links in `index.html`.
- **Typing text**: Edit the `roles` array in `script.js`.

## Deploy to GitHub Pages

1. Create a GitHub repository (example: `portfolio`).
2. Upload/push all files from this folder.
3. In GitHub repo settings:
   - Go to **Settings → Pages**
   - **Source**: Deploy from a branch
   - **Branch**: `main` (or `master`) and `/ (root)`
4. Save. After a minute, your site will be live at:
   - `https://<your-username>.github.io/<repo-name>/`

## Notes

- This site uses **AOS** via CDN for scroll animations.
- Contact form uses **mailto** (no backend needed). If you want a real form submission, you can add Formspree/Web3Forms later.

