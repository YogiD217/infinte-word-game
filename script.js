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
    name: "Player 1", // Will be updated on profile selection.
    solution: "",
    currentRow: 0,
    totalPoints: 0,
    totalGuessesInWins: 0,
    correctRounds: 0,
    boardElement: document.getElementById("p1-board"),
    inputElement: document.getElementById("p1-input")
  },
  p2: {
    name: "Richa", // Will be updated on profile selection.
    solution: "",
    currentRow: 0,
    totalPoints: 0,
    totalGuessesInWins: 0,
    correctRounds: 0,
    boardElement: document.getElementById("p2-board"),
    inputElement: document.getElementById("p2-input")
  }
};

// Called when a profile is selected.
function selectProfile(profile) {
  // If the user selects Yogi, assign Yogi to p1 and Richa to p2.
  // If Richa is selected, assign Richa to p1 and Yogi to p2.
  if (profile === "Yogi") {
    players.p1.name = "Yogi";
    players.p2.name = "Richa";
  } else {
    players.p1.name = "Richa";
    players.p2.name = "Yogi";
  }
  // Update the display names.
  document.getElementById("p1-name").textContent = players.p1.name;
  document.getElementById("p2-name").textContent = players.p2.name;
  // Hide the profile selection screen and show the game screen.
  document.getElementById("profile-selection").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  // Initialize both players.
  initPlayer("p1");
  initPlayer("p2");
}

// Initialize each player's board and solution.
function initPlayer(playerId) {
  const player = players[playerId];
  player.boardElement.innerHTML = "";
  player.currentRow = 0;
  // Create 6 empty rows with 5 cells each.
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
  // Randomly select a solution word.
  player.solution = WORDS[Math.floor(Math.random() * WORDS.length)];
  // Clear input field.
  player.inputElement.value = "";
  player.inputElement.focus();
}

// Update player's scoreboard.
function updateScoreboard(playerId) {
  const player = players[playerId];
  document.getElementById(`${playerId}-total-points`).textContent = player.totalPoints;
  document.getElementById(`${playerId}-correct-rounds`).textContent = player.correctRounds;
  const avg = player.correctRounds > 0 ? (player.totalPoints / player.totalGuessesInWins).toFixed(2) : 0;
  document.getElementById(`${playerId}-average-points`).textContent = avg;
}

// Check the guess and update board accordingly.
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
  
  // Prepare an array for cell classes.
  let cellClasses = new Array(5).fill("absent");
  
  // First pass: mark correct letters.
  guessArr.forEach((letter, i) => {
    if (letter === solutionArr[i]) {
      cellClasses[i] = "correct";
      solutionArr[i] = null; // Remove matched letter.
    }
  });
  
  // Second pass: mark present letters.
  guessArr.forEach((letter, i) => {
    if (cellClasses[i] === "correct") return;
    if (solutionArr.includes(letter)) {
      cellClasses[i] = "present";
      // Remove first occurrence.
      const index = solutionArr.indexOf(letter);
      solutionArr[index] = null;
    }
  });
  
  // Update the row's cells.
  Array.from(row.children).forEach((cell, i) => {
    cell.textContent = guessArr[i];
    cell.classList.add(cellClasses[i]);
  });
  
  player.currentRow++;
  
  // Check if guess is correct.
  if (guess === player.solution) {
    // Calculate points based on attempt number.
    const attempt = player.currentRow;
    const pointsEarned = SCORE_BY_ATTEMPT[attempt] || 0;
    player.totalPoints += pointsEarned;
    player.totalGuessesInWins += attempt;
    player.correctRounds++;
    updateScoreboard(playerId);
    alert(`${player.name} guessed correctly in ${attempt} attempt(s)! Earned ${pointsEarned} points.`);
    // Start a new round.
    setTimeout(() => initPlayer(playerId), 500);
    return;
  }
  
  // If reached 6 attempts without a correct guess, round over.
  if (player.currentRow === 6) {
    alert(`${player.name} failed to guess the word. The word was "${player.solution}". Starting new round.`);
    setTimeout(() => initPlayer(playerId), 500);
  }
  
  // Clear the input for next guess.
  player.inputElement.value = "";
  player.inputElement.focus();
}
