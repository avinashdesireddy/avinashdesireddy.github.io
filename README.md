# avinashdesireddy.com

Personal blog — hosted on GitHub Pages at [avinashdesireddy.com](https://avinashdesireddy.com).

## How to add content

### Publish a blog post

Edit `_data/posts.json` and add an object at the top of the array:

```json
{
  "date": "2025-09-15",
  "title": "Your post title here",
  "url": "https://link-to-the-post.com",
  "tags": ["eks", "gpu"],
  "venue": "AWS Containers Blog",
  "status": "published"
}
```

**To add a draft** (shows on site with a "draft" badge, no link):

```json
{
  "date": null,
  "title": "Working title for upcoming post",
  "url": null,
  "tags": ["llm"],
  "venue": null,
  "status": "draft"
}
```

**When the draft goes live**, fill in `date`, `url`, `venue`, and change `status` to `"published"`.

### Add a talk or workshop

Edit `_data/talks.json` and add an object:

```json
{
  "date": "2025-11",
  "title": "Talk title",
  "venue": "KubeCon NA 2025",
  "detail": "Lightning talk · 5 min",
  "url": "https://link-to-slides-or-recording.com",
  "tags": ["eks", "gpu"]
}
```

`detail`, `url`, and `tags` are all optional.

### Update your bio or links

Edit `_data/profile.json`. The `bio` field is an array of paragraphs — add, remove, or reorder freely.

---

## File structure

```
├── index.html          ← page shell — never needs editing
├── css/
│   └── style.css       ← all styles
├── js/
│   └── site.js         ← renderer + filter logic
└── _data/
    ├── profile.json    ← bio, tagline, social links
    ├── posts.json      ← blog posts (published + drafts)
    └── talks.json      ← conference talks and workshops
```

## Available tags

`eks` · `gpu` · `llm` · `containers` · `data` · `agentic`

Add new tags freely — just include them in a post's `tags` array and they'll appear automatically in the sidebar filter.

## Local preview

Because the site fetches JSON via `fetch()`, you need a local server (not `file://`):

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.
