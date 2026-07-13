# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Local Preview

The site uses `fetch()` for JSON data, so `file://` won't work. Start a local server:

```bash
python3 -m http.server 8000
# or: npx serve .
```

Open `http://localhost:8000`.

## Architecture

Static personal site hosted on GitHub Pages (no build step, no framework). The page shell (`index.html`) is empty markup; `js/site.js` fetches JSON from `_data/` at runtime and renders everything client-side.

**Data-driven rendering flow:**
1. `index.html` loads — contains only empty container elements
2. `js/site.js` fetches all four JSON files in parallel
3. `renderSidebar()` populates name/bio/links from `profile.json`
4. `renderPosts()` groups posts by year, builds tag filter buttons from all tags found across posts
5. `renderTalks()` and `renderOSS()` append their sections
6. `initFilter()` wires up click-based tag filtering across posts and talks

**Key constraint:** The `index.html` shell never needs editing. All content changes go through `_data/` JSON files.

## Content Operations

- **Add a blog post:** prepend to `_data/posts.json` array
- **Add a talk/workshop:** prepend to `_data/talks.json` array
- **Add an OSS project:** append to `_data/oss.json` array
- **Update bio/links:** edit `_data/profile.json`

Post objects support a `links` array for inline badges (repo, slides, etc.):
```json
"links": [{ "label": "repo", "url": "https://..." }]
```

Draft posts use `"status": "draft"` with null `date`/`url`/`venue`.

## Available Tags

`eks` · `gpu` · `llm` · `containers` · `data` · `agentic`

New tags auto-appear in the sidebar filter when used in any post's `tags` array.

## Deployment

Push to `main` → GitHub Pages serves immediately. The `.nojekyll` file ensures `_data/` is served directly without Jekyll processing. Custom domain: `avinashdesireddy.com` (via `CNAME` file).
