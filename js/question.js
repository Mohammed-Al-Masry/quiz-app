"use strict"

export default class Question {
  // Create constructor for store question data
  constructor(quiz, container, onQuizEnd) {
    this.quiz = quiz;
    this.container = container;
    this.onQuizEnd = onQuizEnd;
    this.questionData = quiz.getCurrentQuestion();
    this.index = quiz.currentQuestionIndex;
    this.question = this.decodeHtml(this.questionData.question);
    this.correctAnswer = this.decodeHtml(this.questionData.correct_answer);
    this.category = this.decodeHtml(this.questionData.category);
    this.wrongAnswers = this.questionData.incorrect_answers.map((answer) =>
      this.decodeHtml(answer)
    );
    this.allAnswers = this.shuffleAnswers();
    this.answered = false;
    this.timerInterval = null;
    this.timeRemaining = 30;
  };

  // Create method for decoding html
  decodeHtml(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent;
  };

  // Create method to shuffling the answers
  shuffleAnswers() {
    const answers = this.wrongAnswers.concat(this.correctAnswer);
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    };
    return answers;
  };

  // Create method for getting progress by percentage
  getProgress() {
    return Math.round(((this.index + 1) / this.quiz.numberOfQuestions) * 100);
  };

  // Create method for display question
  displayQuestion() {
    let answersAvailable = ``;
    this.allAnswers.forEach((answer, idx) => {
      answersAvailable += `<button class="answer-btn" data-answer="${answer}">
          <span class="answer-key">${idx + 1}</span>
          <span class="answer-text">${answer}</span>
        </button>`;
    });

    const card = `<div class="game-card question-card">
      
      <div class="xp-bar-container">
        <div class="xp-bar-header">
          <span class="xp-label"><i class="fa-solid fa-bolt"></i> Progress</span>
          <span class="xp-value">Question ${this.index + 1}/${
      this.quiz.numberOfQuestions
    }</span>
        </div>
        <div class="xp-bar">
          <div class="xp-bar-fill" style="width: ${this.getProgress()}%"></div>
        </div>
      </div>

      <div class="stats-row">
        <div class="stat-badge category">
          <i class="fa-solid fa-bookmark"></i>
          <span>${this.category}</span>
        </div>
        <div class="stat-badge difficulty easy">
          <i class="fa-solid fa-face-smile"></i>
          <span>${this.quiz.difficulty}</span>
        </div>
        <div class="stat-badge timer">
          <i class="fa-solid fa-stopwatch"></i>
          <span class="timer-value">${this.timeRemaining}</span>s
        </div>
        <div class="stat-badge counter">
          <i class="fa-solid fa-gamepad"></i>
          <span>${this.index + 1}/${this.quiz.numberOfQuestions}</span>
        </div>
      </div>

      <h2 class="question-text">${this.question}</h2>

      <div class="answers-grid">
        ${answersAvailable}
      </div>

      <p class="keyboard-hint">
        <i class="fa-regular fa-keyboard"></i> Press 1-${
          this.allAnswers.length
        } to select
      </p>

      <div class="score-panel">
        <div class="score-item">
          <div class="score-item-label">Score</div>
          <div class="score-item-value">${this.quiz.score}</div>
        </div>
      </div>
    </div>`;
    this.container.innerHTML = card;
    this.addEventListeners();
    this.startTimer();
  };

  // Create method for add event listener to the answer buttons
  addEventListeners() {
    const answerButtons = document.querySelectorAll(".answer-btn");
    answerButtons.forEach((button, idx) => {
      button.addEventListener("click", () => {
        this.checkAnswer(button);
      });
      button.addEventListener("keydown", (e) => {
        if (e.key === idx + 1) {
          this.checkAnswer(button);
        };
      });
    });
  };

  // Create method for remove event listener that capturing keyboard keys
  removeEventListeners() {
    removeEventListener("keydown", this.addEventListeners, true);
  };

  // Create method to set timer for the question
  startTimer() {
    const timer = document.querySelector(".timer-value");
    const timerState = document.querySelector(".timer");
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      timer.textContent = this.timeRemaining;
      if (this.timeRemaining <= 10) {
        timerState.classList.add("warning");
      } else if (this.timeRemaining <= 0) {
        this.stopTimer();
        this.handleTimeUp();
      };
    }, 1000);
  };

  // Create method to stop timer for the question
  stopTimer() {
    clearInterval(this.timerInterval);
  };

  // Create method for show "time's up" message and reveal the correct answer
  handleTimeUp() {
    this.answered = true;
    this.removeEventListeners();
    const theCorrectAnswer = document.querySelector(
      `button[data-answer=${this.correctAnswer}]`
    );
    theCorrectAnswer.classList.add("correct");
    const showTimesUpMessage = document.querySelector(".score-panel");
    showTimesUpMessage.before(`<div class="time-up-message">
      <i class="fa-solid fa-clock"></i> TIME'S UP!
    </div>`);
    this.animateQuestion(2000);
  };

  // Create method for checking the answer is correct or wrong
  checkAnswer(choiceElement) {
    if (this.answered) {
      return;
    };

    this.answered = true;
    this.stopTimer();
    this.removeEventListeners();

    const selectedAnswer = choiceElement.dataset.answer;

    if (selectedAnswer === this.correctAnswer) {
      choiceElement.classList.add("correct");
      this.quiz.incrementScore();
    } else {
      choiceElement.classList.add("wrong");
      this.highlightCorrectAnswer();
    };

    const answerButtons = document.querySelectorAll(".answer-btn");
    answerButtons.forEach((button) => {
      button.classList.add("disabled");
    });

    this.animateQuestion(2000);
  };

  // Create method for highlight the correct answer if the wrong answer has been chosen
  highlightCorrectAnswer() {
    const correctAnswerButton = document.querySelector(`button[data-answer="${this.correctAnswer}"]`);
    correctAnswerButton.classList.add("correct-reveal");
  };

  // Create method for getting next question or display the final results
  getNextQuestion() {
    if (this.quiz.nextQuestion()) {
      const nextQuestion = new Question(this.quiz, this.container, this.onQuizEnd);
      nextQuestion.displayQuestion();
    } else {
      this.container.innerHTML = this.quiz.endQuiz();
      const playAgainBtn = document.querySelector(".btn-restart");
      playAgainBtn.addEventListener("click", this.onQuizEnd);
    };
  };

  // Create method for displaying next question after 2s
  animateQuestion(duration) {
    setTimeout(() => {
      const questionCard = document.querySelector(".question-card");
      questionCard.classList.add("exit");
    }, 1500);
    setTimeout(() => {
      this.getNextQuestion();
    }, duration);
  };
};
