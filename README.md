# GameDay Content Planner

## Live site
https://lindsaymk05.github.io/ai101-midterm-gameday-content-planner/

## Audience and purpose
This project is for college athletics communications and social media staff who need to organize game-day coverage.

## Features
- Enter sport, opponent, date, and time; the matchup summary updates and the details save in the browser.
- Track a checklist, add custom tasks, and see progress update.
- Use a four-window posting schedule for pregame, warmups, in-game, and postgame coverage.
- Explore five sample college locations on a CesiumJS 3D globe and select a venue to focus the map.

## How to use
1. Enter the sport, opponent, game date, and time.
2. Check off completed tasks or add a custom task.
3. Follow the posting schedule.
4. In Venue Explorer, drag the globe to rotate, scroll to zoom, click a marker, or choose a location from the dropdown.

## Sources and credits
- CesiumJS: https://cesium.com/platform/cesiumjs/
- CesiumJS Quickstart: https://cesium.com/learn/cesiumjs-learn/cesiumjs-quickstart/
- Google Fonts: DM Sans and Manrope, https://fonts.google.com/

## Known limitations
- Venue locations are demonstration points and are not verified event venues. Confirm exact locations before publishing event information.
- The globe loads CesiumJS and OpenStreetMap tiles from external services, so an internet connection is required. This version uses a basic ellipsoid globe rather than terrain requiring a Cesium ion token.
- Checklist and game details save only in the current browser on the current device; they do not sync across devices.
- The app does not publish posts to social platforms or verify game scores automatically.


### Cesium imagery troubleshooting
The venue explorer uses CesiumJS `UrlTemplateImageryProvider` with Esri World Imagery tiles. If the imagery does not load, check the browser console and confirm the network allows requests to `server.arcgisonline.com`.
