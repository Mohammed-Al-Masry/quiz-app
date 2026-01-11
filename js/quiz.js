"use strict"

export default class Quiz {
  // Create constructor for the player
  constructor(category, difficulty, numberOfQuestions, playerName) {
    this.category = category;
    this.difficulty = difficulty;
    this.numberOfQuestions = numberOfQuestions;
    this.playerName = playerName;
    this.score = 0;
    this.questions = [];
    this.currentQuestionIndex = 0;
  };

  // Create async method to get questions from API
  async getQuestions() {
    const url = this.buildApiUrl();
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (!data.response_code === 0) throw new Error(`response code error! status: ${data.response_code}`);
      this.questions = data.results;
    } catch (error) {
      console.log(error)
    };
    return this.questions;
  };

  // Create method for API
  buildApiUrl() {
    const baseUrl = "https://opentdb.com/api.php";
    const params = new URLSearchParams();
    params.append("amount", this.numberOfQuestions);
    if (this.category) {
      params.append("category", this.category);
    };
    if (this.difficulty) {
      params.append("difficulty", this.difficulty);
    };
    return `${baseUrl}?${params.toString()}`;
  };

  // Create method to increase score
  incrementScore() {
    this.score++;
  };

  // Create method to get index of the current question
  getCurrentQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      return this.questions[this.currentQuestionIndex];
    } else {
      return null;
    };
  };

  // Create method for get next question
  nextQuestion() {
    this.currentQuestionIndex++;
    const completed = this.isComplete(this.currentQuestionIndex);
    if (!completed) {
      return true;
    } else {
      return false;
    };
  };

  // Create method to know if questions completed
  isComplete(questionIndex) {
    if (questionIndex >= this.questions.length) {
      return true;
    };
  };

  // Create method for get final score
  getScorePercentage() {
    return Math.round((this.score / this.numberOfQuestions) * 100);
  };

  // Create method to save the top 10 of high scores in local storage
  saveHighScore() {
    const highScores = this.getHighScores();
    const newScore = {
      playerName: this.playerName,
      score: this.score,
      total: this.numberOfQuestions,
      percentage: this.getScorePercentage(),
      difficulty: this.difficulty,
      date: new Date().toISOString()
    };
    highScores.push(newScore);
    highScores.sort((a, b) => b.percentage - a.percentage);
    highScores.splice(10);
    localStorage.setItem("quizHighScores", JSON.stringify(highScores));
  };

  // Create method to get high scores data from local storage
  getHighScores() {
    try {
      const highScores = localStorage.getItem("quizHighScores");
      return highScores ? JSON.parse(highScores) : [];

    } catch (error) {
      console.log(error);
    };
  };

  // Create method to check if player's high scores higher than others
  isHighScore() {
    const percentage = this.getScorePercentage();
    const highScores = this.getHighScores();
    if (highScores.length < 10 || percentage > highScores[highScores.length - 1].percentage) {
      return true;
    } else {
      return false;
    };
  };

  // Create method for display final result and high scores leaderboard
  endQuiz() {
    const percentage = this.getScorePercentage();
    const higherScore = this.isHighScore();
    if (higherScore) {
      this.saveHighScore();
    };
    const highScores = this.getHighScores();
    let leaderboard = ``;
    for (let i = 0; i < Math.min(highScores.length, 10); i++) {
      if (i === 0) {
        leaderboard += `<li class="leaderboard-item gold">
            <span class="leaderboard-rank">#${i + 1}</span>
            <span class="leaderboard-name">${highScores[i].playerName}</span>
            <span class="leaderboard-score">${highScores[i].percentage}%</span>
          </li>`;

      } else if (i === 1) {
        leaderboard += `<li class="leaderboard-item silver">
            <span class="leaderboard-rank">#${i + 1}</span>
            <span class="leaderboard-name">${highScores[i].playerName}</span>
            <span class="leaderboard-score">${highScores[i].percentage}%</span>
          </li>`;

      } else if (i === 2) {
        leaderboard += `<li class="leaderboard-item bronze">
            <span class="leaderboard-rank">#${i + 1}</span>
            <span class="leaderboard-name">${highScores[i].playerName}</span>
            <span class="leaderboard-score">${highScores[i].percentage}%</span>
          </li>`;

      } else {
        leaderboard += `<li class="leaderboard-item">
            <span class="leaderboard-rank">#${i + 1}</span>
            <span class="leaderboard-name">${highScores[i].playerName}</span>
            <span class="leaderboard-score">${highScores[i].percentage}%</span>
          </li>`;

      };
    };
    return `<div class="game-card results-card">
      <h2 class="results-title">Quiz Complete!</h2>
      <p class="results-score-display">${this.score}/${
      this.numberOfQuestions
    }</p>
      <p class="results-percentage">${percentage}% Accuracy</p>
      
      ${
        higherScore
          ? `<div class="new-record-badge">
        <i class="fa-solid fa-star"></i> New High Score!
      </div>`
          : ``
      }
      
      <div class="leaderboard">
        <h4 class="leaderboard-title">
          <i class="fa-solid fa-trophy"></i> Leaderboard
        </h4>
        <ul class="leaderboard-list">

          ${leaderboard}

        </ul>
      </div>
      
      <div class="action-buttons">
        <button class="btn-restart">
          <i class="fa-solid fa-rotate-right"></i> Play Again
        </button>
      </div>
    </div>`;
  };
};
