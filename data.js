// Mini DLS26 Tournament Data

// Teams - 8 teams in the league (using manager names)
const TEAMS = [
    { id: 1, name: "Manchester United", manager: 'Kevin' },
    { id: 2, name: "Otokolo FC", manager: 'Otokolo' },
    { id: 3, name: "Divine FC", manager: 'Divine' },
    { id: 4, name: "Adedoyin United", manager: 'Adedoyin' },
    { id: 5, name: "Real Maadrid", manager: 'Somto' },
    { id: 6, name: "Obakings", manager: 'Oba' },
    { id: 7, name: "Liverpool", manager: 'Layomi' },
    { id: 8, name: "Ebenezer FC", manager: 'Ebenezer' }
];

// Generate fixtures based on the actual schedule from fixtures data.txt
function generateFixtures() {
    const fixtures = [];
    let matchId = 1;

    const schedule = [
        // Round 1 (Home)
        { home: 'Otokolo', away: 'Divine', round: 1 },
        { home: 'Adedoyin', away: 'Kevin', round: 1 },
        { home: 'Somto', away: ' Oba', round: 1 },
        { home: 'Layomi', away: 'Ebenezer', round: 1 },
        // Round 2 (Away)
        { home: 'Divine', away: 'Otokolo', round: 2 },
        { home: 'Kevin', away: 'Adedoyin', round: 2 },
        { home: ' Oba', away: 'Somto', round: 2 },
        { home: 'Ebenezer', away: 'Layomi', round: 2 },

        // Round 3 (Home)
        { home: 'Otokolo', away: 'Kevin', round: 3 },
        { home: 'Divine', away: ' Oba', round: 3 },
        { home: 'Adedoyin', away: 'Ebenezer', round: 3 },
        { home: 'Somto', away: 'Layomi', round: 3 },
        // Round 4 (Away)
        { home: 'Kevin', away: 'Otokolo', round: 4 },
        { home: ' Oba', away: 'Divine', round: 4 },
        { home: 'Ebenezer', away: 'Adedoyin', round: 4 },
        { home: 'Layomi', away: 'Somto', round: 4 },

        // Round 5 (Home)
        { home: 'Otokolo', away: ' Oba', round: 5 },
        { home: 'Kevin', away: 'Ebenezer', round: 5 },
        { home: 'Divine', away: 'Layomi', round: 5 },
        { home: 'Adedoyin', away: 'Somto', round: 5 },
        // Round 6 (Away)
        { home: ' Oba', away: 'Otokolo', round: 6 },
        { home: 'Ebenezer', away: 'Kevin', round: 6 },
        { home: 'Layomi', away: 'Divine', round: 6 },
        { home: 'Somto', away: 'Adedoyin', round: 6 },

        // Round 7 (Home)
        { home: 'Otokolo', away: 'Ebenezer', round: 7 },
        { home: ' Oba', away: 'Layomi', round: 7 },
        { home: 'Kevin', away: 'Somto', round: 7 },
        { home: 'Divine', away: 'Adedoyin', round: 7 },
        // Round 8 (Away)
        { home: 'Ebenezer', away: 'Otokolo', round: 8 },
        { home: 'Layomi', away: ' Oba', round: 8 },
        { home: 'Somto', away: 'Kevin', round: 8 },
        { home: 'Adedoyin', away: 'Divine', round: 8 },

        // Round 9 (Home)
        { home: 'Otokolo', away: 'Layomi', round: 9 },
        { home: 'Ebenezer', away: 'Somto', round: 9 },
        { home: ' Oba', away: 'Adedoyin', round: 9 },
        { home: 'Kevin', away: 'Divine', round: 9 },
        // Round 10 (Away)
        { home: 'Layomi', away: 'Otokolo', round: 10 },
        { home: 'Somto', away: 'Ebenezer', round: 10 },
        { home: 'Adedoyin', away: ' Oba', round: 10 },
        { home: 'Divine', away: 'Kevin', round: 10 },

        // Round 11 (Home)
        { home: 'Otokolo', away: 'Somto', round: 11 },
        { home: 'Layomi', away: 'Adedoyin', round: 11 },
        { home: 'Ebenezer', away: 'Divine', round: 11 },
        { home: ' Oba', away: 'Kevin', round: 11 },
        // Round 12 (Away)
        { home: 'Somto', away: 'Otokolo', round: 12 },
        { home: 'Adedoyin', away: 'Layomi', round: 12 },
        { home: 'Divine', away: 'Ebenezer', round: 12 },
        { home: 'Kevin', away: ' Oba', round: 12 },

        // Round 13 (Home)
        { home: 'Otokolo', away: 'Adedoyin', round: 13 },
        { home: 'Somto', away: 'Divine', round: 13 },
        { home: 'Layomi', away: 'Kevin', round: 13 },
        { home: 'Ebenezer', away: ' Oba', round: 13 },
        // Round 14 (Away)
        { home: 'Adedoyin', away: 'Otokolo', round: 14 },
        { home: 'Divine', away: 'Somto', round: 14 },
        { home: 'Kevin', away: 'Layomi', round: 14 },
        { home: ' Oba', away: 'Ebenezer', round: 14 }
    ];

    schedule.forEach(match => {
        const homeTeam = TEAMS.find(t => t.manager === match.home);
        const awayTeam = TEAMS.find(t => t.manager === match.away);

        if (homeTeam && awayTeam) {
            fixtures.push({
                id: matchId++,
                homeTeamId: homeTeam.id,
                homeTeamName: homeTeam.name,
                awayTeamId: awayTeam.id,
                awayTeamName: awayTeam.name,
                homeScore: null,
                awayScore: null,
                scorers: [],
                cards: [],
                status: 'pending',
                round: match.round
            });
        }
    });

    return fixtures;
}

// Initialize data storage
let leagueData = {
    fixtures: generateFixtures(),
    players: {},
    stats: {}
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('mini-dls26-league');
    if (saved) {
        leagueData = JSON.parse(saved);
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('mini-dls26-league', JSON.stringify(leagueData));
}

// Initialize players for each team
function initializePlayers() {
    TEAMS.forEach(team => {
        leagueData.players[team.id] = {
            [team.id]: [] // Players will be added dynamically
        };
    });
}

// Add scorer to a match
function addScorer(matchId, teamId, playerName, minute, isAssist = false) {
    const match = leagueData.fixtures.find(f => f.id === matchId);
    if (!match) return;

    match.scorers.push({
        playerName,
        teamId,
        minute,
        isAssist
    });

    // Track player stats
    if (!leagueData.stats[playerName]) {
        leagueData.stats[playerName] = {
            name: playerName,
            teamId,
            goals: 0,
            assists: 0
        };
    }

    if (isAssist) {
        leagueData.stats[playerName].assists++;
    } else {
        leagueData.stats[playerName].goals++;
    }

    saveData();
}

// Add card to a match
function addCard(matchId, teamId, playerName, cardType, minute) {
    const match = leagueData.fixtures.find(f => f.id === matchId);
    if (!match) return;

    match.cards.push({
        playerName,
        teamId,
        cardType, // 'yellow' or 'red'
        minute
    });

    saveData();
}

// Record match result
function recordResult(matchId, homeScore, awayScore) {
    const match = leagueData.fixtures.find(f => f.id === matchId);
    if (!match) return;

    match.homeScore = homeScore;
    match.awayScore = awayScore;
    match.status = 'completed';

    saveData();
}

// Calculate league standings
function calculateStandings() {
    const standings = TEAMS.map(team => ({
        teamId: team.id,
        teamName: team.name,
        manager: team.manager,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        yellowCards: 0,
        redCards: 0
    }));

    // Process completed fixtures
    leagueData.fixtures.forEach(fixture => {
        if (fixture.status === 'completed') {
            const homeTeam = standings.find(t => t.teamId === fixture.homeTeamId);
            const awayTeam = standings.find(t => t.teamId === fixture.awayTeamId);

            if (homeTeam && awayTeam) {
                homeTeam.played++;
                awayTeam.played++;

                homeTeam.goalsFor += fixture.homeScore;
                homeTeam.goalsAgainst += fixture.awayScore;

                awayTeam.goalsFor += fixture.awayScore;
                awayTeam.goalsAgainst += fixture.homeScore;

                if (fixture.homeScore > fixture.awayScore) {
                    homeTeam.won++;
                    homeTeam.points += 3;
                    awayTeam.lost++;
                } else if (fixture.homeScore < fixture.awayScore) {
                    awayTeam.won++;
                    awayTeam.points += 3;
                    homeTeam.lost++;
                } else {
                    homeTeam.drawn++;
                    homeTeam.points += 1;
                    awayTeam.drawn++;
                    awayTeam.points += 1;
                }

                // Count cards
                fixture.cards.forEach(card => {
                    if (card.teamId === fixture.homeTeamId) {
                        if (card.cardType === 'yellow') homeTeam.yellowCards++;
                        else if (card.cardType === 'red') homeTeam.redCards++;
                    } else if (card.teamId === fixture.awayTeamId) {
                        if (card.cardType === 'yellow') awayTeam.yellowCards++;
                        else if (card.cardType === 'red') awayTeam.redCards++;
                    }
                });
            }
        }
    });

    // Sort by points (descending), then by goal difference, then by goals for
    standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        const gda = a.goalsFor - a.goalsAgainst;
        const gdb = b.goalsFor - b.goalsAgainst;
        if (gdb !== gda) return gdb - gda;
        return b.goalsFor - a.goalsFor;
    });

    return standings;
}

// Get player statistics
function getPlayerStats() {
    const stats = Object.values(leagueData.stats).map(player => ({
        ...player,
        ga: player.goals + player.assists
    }));

    return {
        topScorers: stats.sort((a, b) => b.goals - a.goals).slice(0, 10),
        topAssists: stats.sort((a, b) => b.assists - a.assists).slice(0, 10),
        topGA: stats.sort((a, b) => b.ga - a.ga).slice(0, 10)
    };
}

// Get fixtures for a specific team
function getTeamFixtures(teamId) {
    return leagueData.fixtures.filter(f => 
        f.homeTeamId === teamId || f.awayTeamId === teamId
    );
}

// Get pending fixtures
function getPendingFixtures() {
    return leagueData.fixtures.filter(f => f.status === 'pending');
}

// Get completed fixtures
function getCompletedFixtures() {
    return leagueData.fixtures.filter(f => f.status === 'completed');
}

// Remove scorer from a match
function removeScorer(matchId, index) {
    const match = leagueData.fixtures.find(f => f.id === matchId);
    if (match && match.scorers[index]) {
        const scorer = match.scorers[index];
        match.scorers.splice(index, 1);

        // Update player stats
        if (leagueData.stats[scorer.playerName]) {
            if (scorer.isAssist) {
                leagueData.stats[scorer.playerName].assists--;
            } else {
                leagueData.stats[scorer.playerName].goals--;
            }
        }

        saveData();
    }
}

// Remove card from a match
function removeCard(matchId, index) {
    const match = leagueData.fixtures.find(f => f.id === matchId);
    if (match && match.cards[index]) {
        match.cards.splice(index, 1);
        saveData();
    }
}

// Clear all data (for testing)
function clearAllData() {
    leagueData = {
        fixtures: generateFixtures(),
        players: {},
        stats: {}
    };
    saveData();
}

// Export data as JSON
function exportData() {
    return JSON.stringify(leagueData, null, 2);
}

// Import data from JSON
function importData(jsonString) {
    try {
        leagueData = JSON.parse(jsonString);
        saveData();
        return true;
    } catch (e) {
        console.error('Failed to import data:', e);
        return false;
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    loadData();
});
