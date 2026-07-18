// Mini DLS26 League Application

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    populateStandings();
    populateFixtures();
    populatePlayerStats();
    setupResultForm();
    updateMatchSelect();
    updateDataPreview();
}

// ============ TAB NAVIGATION ============
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');

            // Deactivate all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Activate selected tab
            btn.classList.add('active');
            document.getElementById(tabName).classList.add('active');
            
            // Update preview if switching to data tab
            if (tabName === 'data-export') {
                updateDataPreview();
            }
        });
    });
}

// ============ LEAGUE STANDINGS ============
function populateStandings() {
    const standings = calculateStandings();
    const tbody = document.getElementById('standings-body');
    tbody.innerHTML = '';

    standings.forEach((team, index) => {
        const gd = team.goalsFor - team.goalsAgainst;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${index + 1}</strong></td>
            <td><strong>${team.teamName}</strong></td>
            <td><em>${team.manager}</em></td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.goalsFor}</td>
            <td>${team.goalsAgainst}</td>
            <td>${gd > 0 ? '+' : ''}${gd}</td>
            <td><strong>${team.points}</strong></td>
            <td>${team.yellowCards}Y ${team.redCards}R</td>
        `;
        tbody.appendChild(row);
    });
}

// ============ FIXTURES & RESULTS ============
function populateFixtures() {
    const fixturesContainer = document.getElementById('fixtures-list');
    const filter = document.getElementById('fixture-filter').value;
    fixturesContainer.innerHTML = '';

    let fixtures = leagueData.fixtures;
    if (filter === 'pending') {
        fixtures = getPendingFixtures();
    } else if (filter === 'completed') {
        fixtures = getCompletedFixtures();
    }

    if (fixtures.length === 0) {
        fixturesContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 30px;">No fixtures found</p>';
        return;
    }

    // Group fixtures by round
    const fixturesByRound = {};
    fixtures.forEach(fixture => {
        const round = fixture.round || 1;
        if (!fixturesByRound[round]) {
            fixturesByRound[round] = [];
        }
        fixturesByRound[round].push(fixture);
    });

    // Sort rounds numerically and display
    const sortedRounds = Object.keys(fixturesByRound).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedRounds.forEach(round => {
        // Add round header
        const roundHeader = document.createElement('div');
        roundHeader.className = 'matchday-header';
        roundHeader.innerHTML = `<h3>Matchday ${round}</h3>`;
        fixturesContainer.appendChild(roundHeader);

        // Add fixtures for this round
        const roundFixtures = document.createElement('div');
        roundFixtures.className = 'matchday-group';
        
        fixturesByRound[round].forEach(fixture => {
            const card = createFixtureCard(fixture);
            roundFixtures.appendChild(card);
        });
        
        fixturesContainer.appendChild(roundFixtures);
    });
}

function createFixtureCard(fixture) {
    const card = document.createElement('div');
    card.className = 'fixture-card';

    let scoreHTML = '';
    let scorersHTML = '';

    if (fixture.status === 'completed') {
        scoreHTML = `<div class="score">${fixture.homeScore} - ${fixture.awayScore}</div>`;

        // Group scorers and assists
        if (fixture.scorers.length > 0) {
            const homeScorers = fixture.scorers.filter(s => s.teamId === fixture.homeTeamId);
            const awayScorers = fixture.scorers.filter(s => s.teamId === fixture.awayTeamId);

            let homeText = homeScorers
                .map(s => `${s.playerName}${s.isAssist ? ' (assist)' : ''} (${s.minute}')`)
                .join(', ');
            let awayText = awayScorers
                .map(s => `${s.playerName}${s.isAssist ? ' (assist)' : ''} (${s.minute}')`)
                .join(', ');

            if (homeText || awayText) {
                scorersHTML = `
                    <div class="fixture-scorers">
                        <strong style="color: var(--gray-900);">Scorers & Assists:</strong>
                        <div class="scorers-list">
                            ${homeText ? `<strong>${fixture.homeTeamName}:</strong> ${homeText}` : ''}
                            ${homeText && awayText ? '<br>' : ''}
                            ${awayText ? `<strong>${fixture.awayTeamName}:</strong> ${awayText}` : ''}
                        </div>
                    </div>
                `;
            }
        }
    } else {
        scoreHTML = `<div class="score pending">vs</div>`;
    }

    card.innerHTML = `
        <div class="fixture-match">
            <div class="team">
                <div class="team-name">${fixture.homeTeamName}</div>
            </div>
            ${scoreHTML}
            <div class="team">
                <div class="team-name">${fixture.awayTeamName}</div>
            </div>
        </div>
        ${scorersHTML}
    `;

    return card;
}

// Setup filter change
document.addEventListener('DOMContentLoaded', () => {
    const filterSelect = document.getElementById('fixture-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            populateFixtures();
        });
    }
});

// ============ PLAYER STATISTICS ============
function populatePlayerStats() {
    const stats = getPlayerStats();

    // Top Scorers
    const topScorersBody = document.getElementById('top-scorers');
    topScorersBody.innerHTML = '';
    stats.topScorers.forEach((player, index) => {
        const row = document.createElement('tr');
        const team = TEAMS.find(t => t.id === player.teamId);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${team ? team.name : 'Unknown'}</td>
            <td><strong>${player.goals}</strong></td>
        `;
        topScorersBody.appendChild(row);
    });
    if (stats.topScorers.length === 0) {
        topScorersBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999; padding: 20px;">No goals yet</td></tr>';
    }

    // Top Assists
    const topAssistsBody = document.getElementById('top-assists');
    topAssistsBody.innerHTML = '';
    stats.topAssists.forEach((player, index) => {
        const row = document.createElement('tr');
        const team = TEAMS.find(t => t.id === player.teamId);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${team ? team.name : 'Unknown'}</td>
            <td><strong>${player.assists}</strong></td>
        `;
        topAssistsBody.appendChild(row);
    });
    if (stats.topAssists.length === 0) {
        topAssistsBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999; padding: 20px;">No assists yet</td></tr>';
    }

    // Top G&A
    const topGABody = document.getElementById('top-ga');
    topGABody.innerHTML = '';
    stats.topGA.forEach((player, index) => {
        const row = document.createElement('tr');
        const team = TEAMS.find(t => t.id === player.teamId);
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${team ? team.name : 'Unknown'}</td>
            <td><strong>${player.ga}</strong></td>
        `;
        topGABody.appendChild(row);
    });
    if (stats.topGA.length === 0) {
        topGABody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #999; padding: 20px;">No G&A yet</td></tr>';
    }
}

// ============ RESULT FORM ============
function setupResultForm() {
    const form = document.getElementById('result-form');
    if (form) {
        form.addEventListener('submit', handleResultSubmit);
    }

    const matchSelect = document.getElementById('match-select');
    if (matchSelect) {
        matchSelect.addEventListener('change', () => {
            clearFormRows();
        });
    }
}

function updateMatchSelect() {
    const matchSelect = document.getElementById('match-select');
    matchSelect.innerHTML = '<option value="">-- Choose a match --</option>';

    const pendingMatches = getPendingFixtures();

    // Group by round
    const matchesByRound = {};
    pendingMatches.forEach(fixture => {
        const round = fixture.round || 1;
        if (!matchesByRound[round]) {
            matchesByRound[round] = [];
        }
        matchesByRound[round].push(fixture);
    });

    // Add options grouped by matchday
    const sortedRounds = Object.keys(matchesByRound).sort((a, b) => parseInt(a) - parseInt(b));
    
    sortedRounds.forEach(round => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = `Matchday ${round}`;
        
        matchesByRound[round].forEach(fixture => {
            const option = document.createElement('option');
            option.value = fixture.id;
            option.textContent = `${fixture.homeTeamName} vs ${fixture.awayTeamName}`;
            optgroup.appendChild(option);
        });
        
        matchSelect.appendChild(optgroup);
    });
}

function addScorerRow(team) {
    const section = document.getElementById(`${team}-scorers`);
    const row = document.createElement('div');
    row.className = 'scorer-row';
    row.innerHTML = `
        <input type="text" placeholder="Player Name" class="player-name" required>
        <input type="number" placeholder="Minute" min="0" max="120" class="minute" value="0" required>
        <select class="scorer-type" required>
            <option value="goal">Goal</option>
            <option value="assist">Assist</option>
        </select>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remove</button>
    `;
    section.appendChild(row);
}

function addCardRow() {
    const section = document.getElementById('cards-section');
    const row = document.createElement('div');
    row.className = 'card-row';
    row.innerHTML = `
        <input type="text" placeholder="Player Name" class="player-name" required>
        <select class="card-type" required>
            <option value="yellow">Yellow Card</option>
            <option value="red">Red Card</option>
        </select>
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">Remove</button>
    `;
    section.appendChild(row);
}

function clearFormRows() {
    document.getElementById('home-scorers').innerHTML = '';
    document.getElementById('away-scorers').innerHTML = '';
    document.getElementById('cards-section').innerHTML = '';
    document.getElementById('home-score').value = '0';
    document.getElementById('away-score').value = '0';
}

function handleResultSubmit(e) {
    e.preventDefault();

    const matchId = parseInt(document.getElementById('match-select').value);
    const homeScore = parseInt(document.getElementById('home-score').value);
    const awayScore = parseInt(document.getElementById('away-score').value);

    if (!matchId) {
        showAlert('Please select a match', 'error');
        return;
    }

    const match = leagueData.fixtures.find(f => f.id === matchId);
    if (!match) {
        showAlert('Match not found', 'error');
        return;
    }

    // Record the result
    recordResult(matchId, homeScore, awayScore);

    // Add scorers and assists from home team
    const homeScorers = document.querySelectorAll('#home-scorers .scorer-row');
    homeScorers.forEach(row => {
        const playerName = row.querySelector('.player-name').value.trim();
        const minute = parseInt(row.querySelector('.minute').value);
        const type = row.querySelector('.scorer-type').value;

        if (playerName) {
            addScorer(matchId, match.homeTeamId, playerName, minute, type === 'assist');
        }
    });

    // Add scorers and assists from away team
    const awayScorers = document.querySelectorAll('#away-scorers .scorer-row');
    awayScorers.forEach(row => {
        const playerName = row.querySelector('.player-name').value.trim();
        const minute = parseInt(row.querySelector('.minute').value);
        const type = row.querySelector('.scorer-type').value;

        if (playerName) {
            addScorer(matchId, match.awayTeamId, playerName, minute, type === 'assist');
        }
    });

    // Add cards
    const cardRows = document.querySelectorAll('#cards-section .card-row');
    cardRows.forEach(row => {
        const playerName = row.querySelector('.player-name').value.trim();
        const cardType = row.querySelector('.card-type').value;

        if (playerName) {
            // Determine which team player is from (simplified - could be improved)
            const homeTeamCard = confirm(`Is "${playerName}" from ${match.homeTeamName}?`);
            const teamId = homeTeamCard ? match.homeTeamId : match.awayTeamId;
            addCard(matchId, teamId, playerName, cardType, 0);
        }
    });

    // Clear form and refresh all views
    document.getElementById('result-form').reset();
    clearFormRows();
    updateMatchSelect();
    populateStandings();
    populateFixtures();
    populatePlayerStats();

    showAlert('Match result saved successfully!', 'success');

    // Switch to standings tab
    document.querySelector('[data-tab="standings"]').click();
}

// ============ DATA MANAGEMENT ============
function updateDataPreview() {
    const preview = document.getElementById('data-preview');
    if (preview) {
        preview.value = JSON.stringify(leagueData, null, 2);
    }
}

function downloadData() {
    const dataStr = JSON.stringify(leagueData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mini-dls26-league-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showAlert('Data downloaded successfully!', 'success');
}

function uploadData() {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        showAlert('Please select a file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate the imported data has expected structure
            if (!importedData.fixtures || !Array.isArray(importedData.fixtures)) {
                throw new Error('Invalid data format');
            }

            // Import the data
            leagueData = importedData;
            saveData();
            updateDataPreview();
            
            // Refresh all views
            populateStandings();
            populateFixtures();
            populatePlayerStats();
            updateMatchSelect();
            
            showAlert('Data imported successfully!', 'success');
            fileInput.value = ''; // Clear file input
        } catch (error) {
            showAlert(`Error importing data: ${error.message}`, 'error');
        }
    };
    reader.readAsText(file);
}

// ============ UTILITY FUNCTIONS ============
function showAlert(message, type) {
    const tabContent = document.querySelector('.tab-content.active');
    if (tabContent) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        tabContent.insertBefore(alert, tabContent.firstChild);

        setTimeout(() => {
            alert.remove();
        }, 4000);
    }
}

// Refresh all data when tabs change
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(() => {
                const activeTab = document.querySelector('.tab-content.active').id;
                if (activeTab === 'standings') {
                    populateStandings();
                } else if (activeTab === 'fixtures') {
                    populateFixtures();
                } else if (activeTab === 'stats') {
                    populatePlayerStats();
                } else if (activeTab === 'add-result') {
                    updateMatchSelect();
                } else if (activeTab === 'data-export') {
                    updateDataPreview();
                }
            }, 100);
        });
    });
});
