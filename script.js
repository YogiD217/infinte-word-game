// Word list for demonstration – extend as needed.
const WORDS = ["APPLE", "BRAVE", "CRANE", "DREAM", "EAGER", "FRAME", "GRACE", "HEART"];

// Scoring based on attempt number (1-indexed).
const SCORE_BY_ATTEMPT = {
  1: 50,
  2: 40,
  3: 30,
  4: 20,
  5: 10,
  6: 5
};

const players = {
  p1: {
    name: "Player 1", // Will update based on profile selection.
    solution: "",
    currentRow: 0,
    totalPoints: 0,
    totalGuessesInWins: 0,
    correctRounds: 0,
    boardElement: document.getElementById("p1-board"),
    inputElement: document.getElementById("p1-input")
  },
  p2: {
    name: "Richa", // Will update based on profile selection.
    solution: "",
    currentRow: 0,
    totalPoints: 0,
    totalGuessesInWins: 0,
    correctRounds: 0,
    boardElement: document.getElementById("p2-board"),
    inputElement: document.getElementById("p2-input")
  }
};

// Add event listeners so that pressing Enter submits the guess.
players.p1.inputElement.addEventListener('keydown', function(e) {
  if (e.key === "Enter") {
    submitGuess("p1");
  }
});
players.p2.inputElement.addEventListener('keydown', function(e) {
  if (e.key === "Enter") {
    submitGuess("p2");
  }
});

// Called when a profile is selected.
function selectProfile(profile) {
  if (profile === "Yogi") {
    players.p1.name = "Yogi";
    players.p2.name = "Richa";
  } else {
    players.p1.name = "Richa";
    players.p2.name = "Yogi";
  }
  // Update display names.
  document.getElementById("p1-name").textContent = players.p1.name;
  document.getElementById("p2-name").textContent = players.p2.name;
  
  // Hide profile selection and show the game container.
  document.getElementById("profile-selection").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  
  // Initialize p2 first, then p1, so that p1's focus overrides p2's.
  initPlayer("p2");
  initPlayer("p1");
}

// Initialize a player's board and select a random word.
function initPlayer(playerId) {
  const player = players[playerId];
  player.boardElement.innerHTML = "";
  player.currentRow = 0;
  // Create 6 rows with 5 cells each.
  for (let r = 0; r < 6; r++) {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");
    for (let c = 0; c < 5; c++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      rowDiv.appendChild(cellDiv);
    }
    player.boardElement.appendChild(rowDiv);
  }
  // Choose a random solution word.
  player.solution = WORDS[Math.floor(Math.random() * WORDS.length)];
  // Clear input and focus the field.
  player.inputElement.value = "";
  player.inputElement.focus();
}

// Update the player's scoreboard.
function updateScoreboard(playerId) {
  const player = players[playerId];
  const avg = player.correctRounds > 0 ? (player.totalPoints / player.totalGuessesInWins).toFixed(2) : 0;
  document.getElementById(`${playerId}-total-points`).textContent = player.totalPoints;
  document.getElementById(`${playerId}-correct-rounds`).textContent = player.correctRounds;
  document.getElementById(`${playerId}-average-points`).textContent = avg;
}

// Check the guess, update the board, and handle scoring.
function submitGuess(playerId) {
  const player = players[playerId];
  const guess = player.inputElement.value.trim().toUpperCase();
  if (guess.length !== 5) {
    alert("Please enter a 5-letter word.");
    return;
  }
  
  // Get the current row.
  const row = player.boardElement.children[player.currentRow];
  const solutionArr = player.solution.split('');
  const guessArr = guess.split('');
  let cellClasses = new Array(5).fill("absent");

  // First pass: mark correct letters.
  guessArr.forEach((letter, i) => {
    if (letter === solutionArr[i]) {
      cellClasses[i] = "correct";
      solutionArr[i] = null;
    }
  });
  
  // Second pass: mark letters that are present but in the wrong position.
  guessArr.forEach((letter, i) => {
    if (cellClasses[i] === "correct") return;
    if (solutionArr.includes(letter)) {
      cellClasses[i] = "present";
      const index = solutionArr.indexOf(letter);
      solutionArr[index] = null;
    }
  });
  
  // Update the row cells.
  Array.from(row.children).forEach((cell, i) => {
    cell.textContent = guessArr[i];
    cell.classList.add(cellClasses[i]);
  });
  
  player.currentRow++;
  
  // If the guess is correct.
  if (guess === player.solution) {
    const attempt = player.currentRow;
    const pointsEarned = SCORE_BY_ATTEMPT[attempt] || 0;
    player.totalPoints += pointsEarned;
    player.totalGuessesInWins += attempt;
    player.correctRounds++;
    updateScoreboard(playerId);
    alert(`${player.name} guessed correctly in ${attempt} attempt(s)! Earned ${pointsEarned} points.`);
    setTimeout(() => initPlayer(playerId), 500);
    return;
  }
  
  // If the player has used all 6 attempts.
  if (player.currentRow === 6) {
    alert(`${player.name} failed to guess the word. The word was "${player.solution}". Starting new round.`);
    setTimeout(() => initPlayer(playerId), 500);
  }
  
  // Clear the input field and set focus.
  player.inputElement.value = "";
  player.inputElement.focus();
}

// The game starts after profile selection, so no additional onload actions are needed.
window.onload = function() {
  // Wait for the user to select a profile.
};
