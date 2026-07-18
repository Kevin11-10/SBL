# Mini DLS26 Tournament League Table

A dynamic web-based league management system for your 8-team mini DLS26 tournament. Track fixtures, results, player statistics, and standings all in one place!

## Features

✨ **League Table Standings**
- Automatic calculation of points, goal difference, and rankings
- Real-time updates as you record matches
- Color-coded positions (promotion/relegation zones)

🎮 **Fixtures & Results**
- Pre-configured home and away matches (56 total for 8 teams)
- View completed and pending matches
- Display scorers, assists, and players involved

⚽ **Player Statistics**
- Top scorers leaderboard
- Top assists leaderboard
- Goals + Assists (G&A) combined ranking

📊 **Easy Result Recording**
- Simple form to record match scores
- Add multiple scorers and assists per match
- Record yellow and red cards
- Automatic form validation

🔄 **Dynamic Updates**
- League table updates instantly after recording results
- Standings sort by points, goal difference, and goals for
- All statistics calculated in real-time

💾 **Data Persistence**
- Automatically saves to browser's local storage
- No server required - everything works offline
- Data persists even after closing the browser

## Teams

1. Team Alpha
2. Team Bravo
3. Team Charlie
4. Team Delta
5. Team Echo
6. Team Foxtrot
7. Team Golf
8. Team Hotel

*(You can easily customize team names by editing the TEAMS array in data.js)*

## Getting Started

1. Open `index.html` in your web browser
2. Navigate through the tabs:
   - **League Table**: View current standings
   - **Fixtures & Results**: See all matches (pending and completed)
   - **Player Stats**: Check top scorers, assists, and G&A leaders
   - **Add Result**: Record new match results

## How to Record a Match Result

1. Click on the **"Add Result"** tab
2. Select a match from the dropdown
3. Enter the final score for both teams
4. For each goal, click **"+ Add Goal"** and enter:
   - Player name
   - Minute of the goal
   - Whether it was a goal or assist
5. To record cards, click **"+ Add Card"** and enter:
   - Player name
   - Card type (yellow or red)
6. Click **"Save Match Result"** - the league table will update automatically!

## Scoring System

- **Win**: 3 points
- **Draw**: 1 point
- **Loss**: 0 points

## File Structure

```
├── index.html       # Main HTML structure
├── styles.css       # All styling and responsive design
├── app.js           # Application logic and UI interactions
├── data.js          # Tournament data and calculations
└── README.md        # This file
```

## Customization

### Change Team Names

Edit the `TEAMS` array in `data.js`:

```javascript
const TEAMS = [
    { id: 1, name: 'Your Team Name' },
    { id: 2, name: 'Another Team' },
    // ... etc
];
```

### Export/Import Data

You can export and import tournament data:

```javascript
// Export as JSON
const json = exportData();
console.log(json);

// Import from JSON
importData(jsonString);
```

### Clear All Data

To reset the tournament and start over:

```javascript
clearAllData();
```

## Local Storage

All data is stored in your browser's local storage under the key: `mini-dls26-league`

If you want to backup your data:
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find `mini-dls26-league`
4. Copy the entire JSON object

## Browser Compatibility

Works on all modern browsers:
- Chrome/Chromium
- Firefox
- Safari
- Edge

## Tips

💡 **For Better Organization:**
- Use consistent player names (e.g., "John Smith" not "john smith" or "Smith, John")
- Record matches as soon as they're played
- Use jersey numbers in player names if needed (e.g., "10 - John Smith")

📱 **Mobile Friendly:**
- The site is fully responsive and works great on phones and tablets
- Perfect for recording scores during or right after matches

🎯 **League Rules:**
- Each team plays every other team home and away (56 matches total)
- Sorted by points, then goal difference, then goals for
- Great for tracking season-long performance!

## Future Enhancements

Potential features you could add:
- Player profiles with individual statistics
- Match history and replays
- Head-to-head records
- Award winners (best goalkeeper, most assists, etc.)
- Export standings as image or PDF
- Mobile app version

## Questions or Issues?

If you find any bugs or want to suggest improvements, feel free to reach out!

---

**Have fun with your tournament! ⚽🏆**
