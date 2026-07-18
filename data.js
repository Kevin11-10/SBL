// Mini DLS26 Tournament Data

// Teams - 8 teams in the league
const TEAMS = [
    { id: 1, name: "Kevin's Team", manager: 'Kevin' },
    { id: 2, name: "David O.'s Squad", manager: 'David O.' },
    { id: 3, name: "David A. United", manager: 'David A.' },
    { id: 4, name: "Oba FC", manager: 'Oba' },
    { id: 5, name: "Layomi FC", manager: 'Layomi' },
    { id: 6, name: "Somto United", manager: 'Somto' },
    { id: 7, name: "Divine FC", manager: 'Divine' },
    { id: 8, name: "Ebenezer United", manager: 'Ebenezer' }
];

// Generate all fixtures (home and away for 8 teams = 56 matches total)
function generateFixtures() {
    const fixtures = [];
    let matchId = 1;

    for (let i = 0; i < TEAMS.length; i++) {
        for (let j = 0; j < TEAMS.length; j++) {
            if (i !== j) {
                fixtures.push({
                    id: matchId++,
                    homeTeamId: TEAMS[i].id,
                    homeTeamName: TEAMS[i].name,
                    awayTeamId: TEAMS[j].id,
                    awayTeamName: TEAMS[j].name,
                    homeScore: null,
                    awayScore: null,
                    scorers: [],
                    cards: [],
                    status: 'pending' // pending or completed
                });
            }
        }
    }

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
