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
  // Hide profile selection and show game.
  document.getElementById("profile-selection").style.display = "none";
  document.getElementById("game-container").style.display = "flex";
  // Initialize boards.
  initPlayer("p1");
  initPlayer("p2");
}

// Initialize player's board and select a random word.
function initPlayer(playerId) {
  const player = players[playerId];
  player.boardElement.innerHTML = "";
  player.currentRow = 0;
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
  player.solution = WORDS[Math.floor(Math.random() * WORDS.length)];
  player.inputElement.value = "";
  player.inputElement.focus();
}

// Update player's scoreboard.
function updateScoreboard(playerId) {
  const player = players[playerId];
  const avg = player.correctRounds > 0 ? (player.totalPoints / player.totalGuessesInWins).toFixed(2) : 0;
  document.getElementById(`${playerId}-total-points`).textContent = player.totalPoints;
  document.getElementById(`${playerId}-correct-rounds`).textContent = player.correctRounds;
  document.getElementById(`${playerId}-average-points`).textContent = avg;
}

// Check the guess and update board.
function submitGuess(playerId) {
  const player = players[playerId];
  const guess = player.inputElement.value.trim().toUpperCase();
  if (guess.length !== 5) {
    alert("Please enter a 5-letter word.");
    return;
  }
  
  const row = player.boardElement.children[player.currentRow];
  const solutionArr = player.solution.split('');
  const guessArr = guess.split('');
  let cellClasses = new Array(5).fill("absent");

  // Mark correct letters.
  guessArr.forEach((letter, i) => {
    if (letter === solutionArr[i]) {
      cellClasses[i] = "correct";
      solutionArr[i] = null;
    }
  });
  
  // Mark present letters.
  guessArr.forEach((letter, i) => {
    if (cellClasses[i] === "correct") return;
    if (solutionArr.includes(letter)) {
      cellClasses[i] = "present";
      const index = solutionArr.indexOf(letter);
      solutionArr[index] = null;
    }
  });
  
  Array.from(row.children).forEach((cell, i) => {
    cell.textContent = guessArr[i];
    cell.classList.add(cellClasses[i]);
  });
  
  player.currentRow++;
  
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
  
  if (player.currentRow === 6) {
    alert(`${player.name} failed to guess the word. The word was "${player.solution}". Starting new round.`);
    setTimeout(() => initPlayer(playerId), 500);
  }
  
  player.inputElement.value = "";
  player.inputElement.focus();
}

// Make sure the page loads with everything ready.
window.onload = function() {
  // The game will only start after a profile is selected.
};
