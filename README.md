# LastNote site

A one-page Jekyll site for LastNote, in the spirit of naturarum's app page:
quiet paper background, a serif headline, and a single accent color used
sparingly..

## Design notes

- **Colors:** warm paper (`#EDEBE6`), warm-graphite ink (`#23262B`), and one
  accent — a wax-seal oxblood (`#7A2430`) — used only for the "stamp" tags,
  links, and hover states.
- **Type:** Fraunces for headlines, Inter for body text, IBM Plex Mono for
  small uppercase labels ("stamps") and the version/fine-print line.
- **Signature element:** the rotated `.stamp` tags (e.g. "Desktop app",
  "Encrypted") — a nod to a postmark or wax seal, tying back to the idea of
  something sealed until it's needed.
- Everything is hand-written HTML/Sass, no framework — easy to prune.

## Run it locally

You'll need Ruby and Bundler installed.

```bash
bundle install
bundle exec jekyll serve
```

Then open http://localhost:4000.

## What to edit first

1. **`_config.yml`** — set `url`, `baseurl`, `email`, and the real
   `download.mac_url` / `download.windows_url` links (currently `#`
   placeholders), plus version and OS requirements.
2. **`index.html`** — the feature cards and "how it works" steps are
   written generically (local-first, encrypted, organized, exportable).
   Swap in your app's actual features and copy.
3. **`assets/images/`** — drop in a real app screenshot and swap the
   CSS-only `.mock-window` mockup in `index.html`'s hero for an `<img>` if
   you'd rather show the real UI.
4. **Favicon / meta image** — add one to `assets/images/` and reference it
   in `_layouts/default.html`.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In the repo's Settings → Pages, set the source to the branch you pushed
   (e.g. `main`) and folder `/ (root)`.
3. Update `url` and `baseurl` in `_config.yml` to match your GitHub Pages
   URL (baseurl is the repo name if it's a project page, e.g.
   `/lastnote`; leave it empty if this is a `username.github.io` repo).
4. Push — GitHub Pages builds Jekyll sites automatically, no local build
   needed.

## Note

This site was hand-written rather than built and tested with a live Jekyll
server (no Ruby/gem access in the environment it was created in), so do a
`bundle exec jekyll serve` pass before publishing to catch anything that
needs a tweak.
