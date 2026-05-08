const levels = [
  {
    name: "Level 1: Kitten Steps",
    timeLimit: 12,
    words: [
      { spelling: "cat", hint: "A small furry pet that says meow." },
      { spelling: "sun", hint: "It shines brightly in the sky." },
      { spelling: "cup", hint: "You drink water or milk from it." },
      { spelling: "red", hint: "The color of many apples." },
      { spelling: "bed", hint: "A cozy place to sleep." }
    ]
  },
  {
    name: "Level 2: Playful Paws",
    timeLimit: 14,
    words: [
      { spelling: "milk", hint: "A white drink cats may like." },
      { spelling: "fish", hint: "An animal that swims." },
      { spelling: "ball", hint: "A round toy to roll or throw." },
      { spelling: "tree", hint: "It has a trunk, branches, and leaves." },
      { spelling: "book", hint: "You read stories from it." }
    ]
  },
  {
    name: "Level 3: Treat Trail",
    timeLimit: 16,
    words: [
      { spelling: "treat", hint: "A yummy snack for the cat." },
      { spelling: "happy", hint: "How the cat feels after eating." },
      { spelling: "pillow", hint: "A soft cushion for your head." },
      { spelling: "garden", hint: "A place where flowers can grow." },
      { spelling: "window", hint: "A cat may sit here and watch outside." }
    ]
  },
  {
    name: "Level 4: Cat Champion",
    timeLimit: 18,
    words: [
      { spelling: "kitten", hint: "A baby cat." },
      { spelling: "blanket", hint: "It keeps you warm." },
      { spelling: "whisker", hint: "A long hair on a cat's face." },
      { spelling: "playful", hint: "Full of fun and energy." },
      { spelling: "scratch", hint: "What a cat might do with its claws." }
    ]
  }
];

const levelSelect = document.querySelector("#levelSelect");
const levelName = document.querySelector("#levelName");
const wordNumber = document.querySelector("#wordNumber");
const wordTotal = document.querySelector("#wordTotal");
const treatScore = document.querySelector("#treatScore");
const timer = document.querySelector("#timer");
const targetWord = document.querySelector("#targetWord");
const hint = document.querySelector("#hint");
const spellingForm = document.querySelector("#spellingForm");
const answerInput = document.querySelector("#answerInput");
const feedback = document.querySelector("#feedback");
const startButton = document.querySelector("#startButton");
const nextButton = document.querySelector("#nextButton");
const cat = document.querySelector("#cat");
const catMessage = document.querySelector("#catMessage");

const game = {
  levelIndex: 0,
  wordIndex: 0,
  treats: 0,
  remainingTime: 0,
  timerId: null,
  isPlaying: false,
  roundFinished: false,
  mistakeMade: false
};

function setupLevelOptions() {
  levels.forEach((level, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = level.name;
    levelSelect.appendChild(option);
  });
}

function getCurrentLevel() {
  return levels[game.levelIndex];
}

function getCurrentWord() {
  return getCurrentLevel().words[game.wordIndex];
}

function renderGame() {
  const level = getCurrentLevel();
  const word = getCurrentWord();

  levelSelect.value = String(game.levelIndex);
  levelName.textContent = level.name;
  wordNumber.textContent = String(game.wordIndex + 1);
  wordTotal.textContent = String(level.words.length);
  treatScore.textContent = String(game.treats);
  timer.textContent = String(game.remainingTime || level.timeLimit);
  targetWord.textContent = word.spelling;
  hint.textContent = word.hint;
}

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = type ? `feedback ${type}` : "feedback";
}

function setCatMood(mood, message) {
  cat.className = `cat ${mood}`;
  cat.setAttribute("aria-label", mood === "sad" ? "Sad cat" : "Happy cat");
  catMessage.textContent = message;
}

function resetRoundState() {
  clearInterval(game.timerId);
  game.timerId = null;
  game.remainingTime = getCurrentLevel().timeLimit;
  game.isPlaying = false;
  game.roundFinished = false;
  game.mistakeMade = false;
  answerInput.value = "";
  answerInput.disabled = true;
  answerInput.classList.remove("mistake");
  nextButton.disabled = true;
  spellingForm.querySelector("button").disabled = true;
}

function startRound() {
  resetRoundState();
  game.isPlaying = true;
  answerInput.disabled = false;
  spellingForm.querySelector("button").disabled = false;
  startButton.textContent = "Restart Level";
  setFeedback("Type the word exactly. One wrong letter means no treat for this word.");
  setCatMood("happy", "The cat is waiting for a treat.");
  renderGame();
  answerInput.focus();

  game.timerId = setInterval(() => {
    game.remainingTime -= 1;
    timer.textContent = String(game.remainingTime);

    if (game.remainingTime <= 0) {
      finishRound(false, "Time is up! The cat is sad and did not get a treat.");
    }
  }, 1000);
}

function finishRound(wasCorrect, message) {
  if (game.roundFinished) {
    return;
  }

  game.roundFinished = true;
  game.isPlaying = false;
  clearInterval(game.timerId);
  game.timerId = null;
  answerInput.disabled = true;
  spellingForm.querySelector("button").disabled = true;
  nextButton.disabled = false;

  if (wasCorrect) {
    game.treats += 1;
    treatScore.textContent = String(game.treats);
    setFeedback(message, "success");
    setCatMood("happy", "Crunch! The cat enjoyed the treat.");
  } else {
    setFeedback(message, "error");
    setCatMood("sad", "The cat is sad and still hungry.");
  }

  const isLastWord = game.wordIndex === getCurrentLevel().words.length - 1;
  nextButton.textContent = isLastWord ? "Finish Level" : "Next Word";
}

function checkAnswer() {
  if (!game.isPlaying || game.roundFinished) {
    return;
  }

  const answer = answerInput.value.trim().toLowerCase();
  const correctAnswer = getCurrentWord().spelling;

  if (answer === correctAnswer && !game.mistakeMade) {
    finishRound(true, "Perfect spelling! The cat gets a treat.");
    return;
  }

  finishRound(false, `Good try! The spelling was "${correctAnswer}".`);
}

function markMistakeIfNeeded() {
  if (!game.isPlaying || game.roundFinished) {
    return;
  }

  const answer = answerInput.value.trim().toLowerCase();
  const correctAnswer = getCurrentWord().spelling;
  const isCurrentPrefix = correctAnswer.startsWith(answer);

  if (answer === correctAnswer && !game.mistakeMade) {
    finishRound(true, "Perfect spelling! The cat gets a treat.");
    return;
  }

  if (answer.length > 0 && !isCurrentPrefix) {
    game.mistakeMade = true;
    answerInput.classList.add("mistake");
    finishRound(false, "Oops, that letter does not match. The cat is sad and did not get a treat.");
  }
}

function moveToNextWordOrLevel() {
  const level = getCurrentLevel();
  const isLastWord = game.wordIndex === level.words.length - 1;

  if (!isLastWord) {
    game.wordIndex += 1;
    resetRoundState();
    renderGame();
    setFeedback("Press Start Game when you are ready for the next word.");
    setCatMood("happy", "Ready for another spelling treat!");
    startButton.textContent = "Start Word";
    return;
  }

  const levelCompleteMessage = `Level complete! You fed the cat ${game.treats} out of ${level.words.length} treats.`;
  const hasNextLevel = game.levelIndex < levels.length - 1;

  if (hasNextLevel) {
    game.levelIndex += 1;
    game.wordIndex = 0;
    game.treats = 0;
    resetRoundState();
    renderGame();
    setFeedback(`${levelCompleteMessage} Move on to ${getCurrentLevel().name}.`, "success");
    setCatMood("happy", "Great work! A new level is unlocked.");
    startButton.textContent = "Start Next Level";
    return;
  }

  game.levelIndex = 0;
  game.wordIndex = 0;
  game.treats = 0;
  resetRoundState();
  renderGame();
  setFeedback(`${levelCompleteMessage} You finished every level!`, "success");
  setCatMood("happy", "Spelling champion! The cat is full and happy.");
  startButton.textContent = "Play Again";
}

function changeLevel(index) {
  game.levelIndex = index;
  game.wordIndex = 0;
  game.treats = 0;
  resetRoundState();
  renderGame();
  setFeedback("Press Start Game when you are ready.");
  setCatMood("happy", "Ready for spelling treats!");
  startButton.textContent = "Start Game";
}

spellingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  checkAnswer();
});

answerInput.addEventListener("input", markMistakeIfNeeded);

startButton.addEventListener("click", () => {
  if (game.isPlaying || game.roundFinished) {
    game.wordIndex = 0;
    game.treats = 0;
  }
  startRound();
});

nextButton.addEventListener("click", moveToNextWordOrLevel);

levelSelect.addEventListener("change", (event) => {
  changeLevel(Number(event.target.value));
});

setupLevelOptions();
resetRoundState();
renderGame();
