# CricketClub

A browser-based 3D cricket game built with Three.js and cannon-es.

## Run locally

You need a modern browser and a local static web server because the game uses JavaScript ES modules.

```bash
python -m http.server 8000
```

Open http://localhost:8000.

## Controls

- **A / Space** — swing the bat
- **1** — Drive
- **2** — Loft
- **3** — Defend
- **Next Ball** — request the next delivery
- Touch controls are available on mobile.

## Game systems

- 3D stadium, pitch, stands, floodlights, boundary boards and fielding positions
- Ball rigid-body simulation using cannon-es, including gravity, bounce, spin and turf contact
- Timed batting contact and shot selection
- Club, Pro and International difficulty settings
- T10, quick five-over and T20 innings formats
- Overs, wickets, run rate, boundaries and innings state
- Responsive desktop and mobile interface

## Publish as a website with GitHub Pages

1. Open the repository **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Pushes to `main` will run the Pages workflow in `.github/workflows/pages.yml`.
4. When the workflow finishes, open the Pages URL shown in Settings → Pages.

## About realism and assets

The stadium and player figures in this repository are procedurally generated. This is a playable 3D browser game, not a photorealistic AAA sports simulator. Truly lifelike cricketers require licensed high-resolution character meshes, skeleton rigs, motion-captured batting/bowling/fielding animation clips, and substantial QA across browsers and devices. Those asset packs are not included in this repository. The game uses external CDN imports for Three.js and cannon-es.

## Technology

- HTML5, CSS, modern JavaScript ES modules
- Three.js for 3D rendering
- cannon-es for rigid-body physics
- GitHub Pages for static hosting
