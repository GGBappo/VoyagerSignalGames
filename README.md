# Voyager Signal Games Website

This is a static multi-page website for Voyager Signal Games.

Open the home page directly in a browser:

```text
index.html
```

## Pages

- `index.html` - Home page with the studio overview and values.
- `game.html` - Improvised game page.
- `developers.html` - Meet the developers page.
- `updates.html` - Development updates.
- `join.html` - Contact, Discord, and join/community page.

## Customize Content

Most site content lives in `site-data.js`.

Update these sections first:

- `nav` - page navigation labels and links.
- `heroTitle`, `heroText`, and `heroActions` - home page hero.
- `studioBody`, `facts`, and `values` - company overview.
- `gameTitle`, `gameLongPitch`, `gameFacts`, `gamePillars`, and `artwork` - Improvised page.
- `developersIntro` and `developers` - developer profiles, pronouns, roles, team tags, bios, and Discord names.
- `updates` - updates page posts.
- `email`, `socials`, `communityActions`, and `joinActions` - Join Us page links.

Replace the `#` placeholders with real Discord, Steam, itch.io, and YouTube links when they are ready.

## Customize Design

The main design tokens are at the top of `styles.css`.

- `--black`, `--gold`, and `--cream` control the primary Voyager Signal Games palette.
- `--shadow`, `--radius`, and `--max` control the layout feel.

## Assets

The website uses images from the `Art` folder. The original logo remains untouched, and the web version with a transparent background is:

```text
Art/VSG Logo Transparent.png
```

Add new game art to `Art`, then reference it in `site-data.js`:

```js
image: "Art/New Artwork.png"
```
