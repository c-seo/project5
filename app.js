
//BUTTONS
const highScoresBtn = document.getElementById("highScoresBtn");
const saveScoreBtn = document.getElementById("saveScoreBtn");

//INPUT
const usernameInput = document.getElementById("username");

//PAGE
const pages = Array.from(document.getElementsByClassName("page"));

//GAME Elements
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice"));
const scoreText = document.getElementById("score");
const questionCounterText = document.getElementById("questionCounter");

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 8;

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
  {
    question: "Something deep down in my soul said, 'Cry, girl', when I saw you and that girl walkin' around. - Etta James",
    choice1: "A Sunday Kind of Love",
    choice2: "I'd Rather Go Blind",
    choice3: "Something's Got a Hold On Me",
    choice4: "At Last",
    answer: 2
  },
  {
    question: "Laughin' gas these hazmats, fast cats. Linin' 'em up like ass cracks. - Gorillaz",
    choice1: "On Melancholy Hill",
    choice2: "Clint Eastwood",
    choice3: "Feel Good Inc",
    choice4: "Empire Ants",
    answer: 3
  },
  {
    question: "People always told me be careful of what you do. And don't go around breaking young girls' hearts. - Michael Jackson",
    choice1: "Beat It",
    choice2: "Smooth Criminal",
    choice3: "Rock With You",
    choice4: "Billie Jean",
    answer: 4
  },
  {
    question: "He takes the day, but I'm grown (I'm grown). And in your way. In this blue shade. - Amy Winehouse",
    choice1: "Stronger Than Me",
    choice2: "Valerie",
    choice3: "Rehab",
    choice4: "Tears Dry On Their Own",
    answer: 4
  },
  {
    question: "People say I'm a one-hit wonder. But what happens when I have two? - Sharon Van Etten",
    choice1: "I Wish I Knew",
    choice2: "Every Time the Sun Comes Up",
    choice3: "Seventeen",
    choice4: "Let Go",
    answer: 2
  },
  {
    question: "Keep on blaming the machine, yeah I'm talkin' bout it. T-t-t-talkin' bout it. - Janelle Monae",
    choice1: "Pynk",
    choice2: "Q.U.E.E.N",
    choice3: "Tight Rope",
    choice4: "Make Me Feel",
    answer: 3
  },
  {
    question: "Now and then you miss it, sounds make you cry. Some nights you dance with tears in your eyes - Frank Ocean",
    choice1: "Self Control",
    choice2: "Nights",
    choice3: "White Ferrari",
    choice4: "Super Rich Kids",
    answer: 1
  },
  {
    question: "It's just you and me. Oh, and I'm the one that loves you. - Maggie Rogers",
    choice1: "Alaska",
    choice2: "On + Off",
    choice3: "Dog Years",
    choice4: "Light On",
    answer: 3
  },

];

//End Screen Elements
const finalScore = document.getElementById("finalScore");

//High Score Elements
const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

//Simulated Navigation
navigateTo = pageName => {
  pages.forEach(page => {
    if (page.id === pageName) {
      page.classList.remove("hidden");
    } else {
      page.classList.add("hidden");
    }
  });
};

//GAME Functions

playGame = () => {
  startGame();
  navigateTo("game");
};

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  getNewQuestion();
};

getNewQuestion = () => {
  if (availableQuestions.length === 0) {
    //set final score text
    finalScore.innerHTML = score;
    //Go to the end page
    return navigateTo("end");
  }
  questionCounter++;
  questionCounterText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
  });

  //Remove question from available questions
  availableQuestions.splice(questionIndex, 1);

  //let users answer now that question is ready
  acceptingAnswers = true;
};

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    //dont let the user attempt to answer until the new question is ready
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    //Add the correct/incorrect animation

    selectedChoice.parentElement.classList.add(classToApply);

    //Increase the score
    incrementScore(classToApply === "correct" ? CORRECT_BONUS : 0);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      //Load New Question
      getNewQuestion();
    }, 1000);
  });
});

incrementScore = num => {
  score += num;
  scoreText.innerHTML = "Score: " + score;
};

//HIGH SCORES

showHighScores = () => {
  highScoresList.innerHTML = highScores
    .map(
      highScore =>
        `<li class="high-score">${highScore.username} - ${highScore.score}</li>`
    )
    .join("");
  navigateTo("highScores");
};

saveHighScore = () => {
  //add the score, sort the array, and splice off starting at position 5
  highScores.push({ score, username: usernameInput.value });
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(5);
  //Save to local storage for next time
  localStorage.setItem("highScores", JSON.stringify(highScores));
};

usernameInput.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !usernameInput.value;
});

