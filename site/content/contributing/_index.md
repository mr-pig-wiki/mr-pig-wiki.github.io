---
title: Update or Add a Wiki
---

Each group wiki has its own GitHub repository. The main website includes those
repositories as Git submodules and mounts their `content/` directories into the
Hugo site. This keeps ownership of each wiki with the group that maintains it.

## Update an existing wiki

1. Open the wiki's repository in the
   [mr-pig-wiki organization](https://github.com/mr-pig-wiki).
2. Edit the relevant Markdown page and its small assets.
3. Preview the change when practical, then open a pull request against that
   wiki's `main` branch.
4. After the pull request merges, update the wiki's submodule pointer in
   `mr-pig-wiki.github.io` and open a separate main-site pull request.

Do not update the copy under `site/content-sources/` without also committing
the change to the source wiki. A submodule records an exact commit; uncommitted
or fork-only commits cannot be reproduced by the public build.

### Page structure

Use a Hugo page bundle for each page:

```text
content/
├── _index.md
└── example-page/
    ├── index.md
    └── example-image.jpg
```

`content/_index.md` is the wiki landing page. A regular page needs only a title
in its front matter:

```markdown
---
title: Example Page
---

Page content goes here.

![Descriptive image text](example-image.jpg)
```

Use lowercase kebab-case for page folders. Prefer relative links between pages
and assets so the wiki remains portable.

## Files and downloads

- Keep small images and lightweight attachments in the relevant page bundle.
- Do not put large CAD files, datasets, model archives, or similar downloads in
  the wiki or the main website repository.
- The responsible PI or project owner should maintain large files in an
  authoritative Dropbox, OneDrive, or equivalent institutional location.
- Link the wiki page to that owner-managed location.
- If no current link is available, say that the download is pending and name
  the role responsible for providing it. Do not silently substitute a similar
  archive or rehost an unverified copy.

Before publishing files or personal information, confirm that the group has
permission to distribute them and that they contain no protected, confidential,
or sensitive data.

## Create a new group wiki

### 1. Create the source repository

Create a public repository in the `mr-pig-wiki` organization using a clear
lowercase kebab-case name, such as `example-lab-wiki`. Its default branch should
be `main`.

At minimum, add:

```text
example-lab-wiki/
├── README.md
├── CONTRIBUTING.md
└── content/
    └── _index.md
```

The README should identify the group, describe the wiki's scope, and state who
maintains its large external downloads. The contributing guide should document
the page and file rules above.

### 2. Prepare and review the content

Convert the source material into Hugo page bundles, repair internal links, and
review images and downloads. Open and merge a pull request in the new wiki
repository before integrating it into the main site.

### 3. Add the submodule

From a clone of `mr-pig-wiki.github.io`, add the merged wiki repository:

```bash
git submodule add \
  https://github.com/mr-pig-wiki/example-lab-wiki.git \
  site/content-sources/example-lab-wiki
```

Ensure `.gitmodules` uses the public HTTPS URL and tracks `main`:

```ini
[submodule "site/content-sources/example-lab-wiki"]
    path = site/content-sources/example-lab-wiki
    url = https://github.com/mr-pig-wiki/example-lab-wiki.git
    branch = main
```

### 4. Mount it in Hugo

Add a mount to `site/hugo.yaml`, choosing a stable public route:

```yaml
module:
  mounts:
    - source: content
      target: content
    - source: content-sources/example-lab-wiki/content
      target: content/example-lab
```

Add a navigation entry when the wiki should appear in the top menu:

```yaml
menu:
  main:
    - name: Example Lab
      pageRef: /example-lab
      weight: 4
```

### 5. Validate and open the main-site pull request

Clone or test with submodules initialized:

```bash
git submodule update --init --recursive
hugo --gc --minify --source ./site
```

Verify the landing page, representative child pages, images, downloads, search,
and navigation. The main-site pull request should pin an upstream commit that
has already merged into the source wiki. It should not point only to a local
checkout or an unmerged fork commit.

## Updating a submodule after a wiki merge

```bash
git -C site/content-sources/example-lab-wiki fetch origin main
git -C site/content-sources/example-lab-wiki checkout origin/main
git add site/content-sources/example-lab-wiki
git commit -m "Update Example Lab wiki"
```

The main repository's pull-request build validates the complete site without
deploying it. Deployment occurs only after the main-site pull request merges.

## Need access?

If you cannot push to an organization repository, create a fork and open a pull
request from your fork. Ask an organization maintainer to review and merge it.
Never work around missing permissions by embedding a local repository path in
`.gitmodules`.
