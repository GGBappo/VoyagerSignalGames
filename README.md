# Voyager Signal Games Website

This is a static multi-page website for Voyager Signal Games.

Open the home page directly in a browser:

```text
index.html
```

## Pages

- `index.html` - Home page with the studio overview and values.
- `projects.html` - Games in development at the studio.
- `game.html` - Real Certified Bomb Diffuser (really!) game page and concept art.
- `art.html` - Full art gallery with links to original images.
- `developers.html` - Meet the developers page.
- `updates.html` - Development updates.
- `join.html` - Contact, Discord, and join/community page.

## Customize Content

Most site content lives in `site-data.js`.

Update these sections first:

- `nav` - page navigation labels and links.
- `heroTitle`, `heroText`, and `heroActions` - home page hero.
- `studioBody`, `facts`, and `values` - company overview.
- `gameTitle`, `gameLongPitch`, `gameFacts`, and `gamePillars` - RCBDr page.
- `artwork` - Gallery categories, artwork titles, and captions. Entries marked `featured` also appear on the RCBDr page.
- `developersIntro` and `developers` - developer profiles, pronouns, roles, team tags, bios, and Discord names.
- `updates` - updates page posts.
- `email`, `communityActions`, and `joinActions` - Join Us page links.

## Customize Design

The main design tokens are at the top of `styles.css`.

- `--black`, `--gold`, and `--cream` control the primary Voyager Signal Games palette.
- `--shadow`, `--radius`, and `--max` control the layout feel.

## Assets

The website uses images from the `Art` folder. The original logo remains untouched, and the web version with a transparent background is:

```text
Art/VSG Logo Transparent.png
```

Add each original PNG to `Art` and a matching WebP preview to `Art/previews`. Use the same base filename for both, then add an entry in `site-data.js`:

```js
{ group: "Character designs", title: "New Character", file: "New Artwork.png", text: "Early character turnaround." }
```
