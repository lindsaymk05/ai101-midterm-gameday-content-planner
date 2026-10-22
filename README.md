# GameDay Content Planner

A responsive, front-end website that helps college athletics social media staff and student workers organize game-day content.

## Features

- Game details: choose a sport, enter an opponent, date, and time.
- Eight starter checklist tasks covering pregame, warmups, in-game, and postgame.
- Live completion count and progress bar.
- Add custom tasks and remove custom tasks.
- Reset the checklist or clear game details independently.
- Automatic saving in the browser using `localStorage`.
- Responsive layout for desktop, tablet, and mobile.
- Basic accessibility support with labels, focus states, and a live status message.

## Files

- `index.html` — page content and structure.
- `style.css` — colors, layout, responsive styling, and visual design.
- `app.js` — checklist behavior, progress, game details, and local saving.

## Run the project

1. Download or unzip the project folder.
2. Open `index.html` in a browser.
3. Enter a sport, opponent, date, or time.
4. Check off tasks and try adding a custom task.

No installation or API key is needed.

## Publish with GitHub Pages

1. Open your GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository's root folder.
3. Open **Settings → Pages**.
4. Under the build/deployment settings, choose **Deploy from a branch**.
5. Choose your main branch and the `/(root)` folder, then save.
6. Wait for GitHub Pages to publish, then open the URL it provides.

If the site is already published, replacing the three website files in the repository with these versions should update it after GitHub Pages finishes deploying.

## Testing checklist

- [ ] Page loads without missing CSS or JavaScript.
- [ ] Sport, opponent, date, and time appear in the game summary.
- [ ] Checking and unchecking a task updates the counts and progress bar.
- [ ] Completing all tasks shows 100%.
- [ ] A custom task can be added and removed.
- [ ] Checklist and game details remain after refreshing the page.
- [ ] Reset checklist clears task completion and custom tasks without clearing game details.
- [ ] Reset details clears game information without clearing task progress.
- [ ] Layout works at desktop and mobile widths.

## Current limitations

- Data is saved only in the current browser on the current device. It is not shared with teammates and may be lost if browser site data is cleared.
- The posting schedule is a suggested timeline, not a live scheduler. It does not publish posts to social media.
- There is no AI caption generator, login, or backend in this version.
- The Google Fonts link requires an internet connection; the page still has fallback fonts.

## Suggested future improvements

- Editable posting schedule and reminders.
- Export or print a game-day plan.
- AI caption ideas with a connected, securely configured service.
- Shared team workspaces and cloud saving.
