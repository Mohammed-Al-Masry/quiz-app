"use strict"
// import methods from another modules
import Quiz from "https://mohammed-al-masry.github.io/quiz-app/js/quiz.js";
import Question from "https://mohammed-al-masry.github.io/quiz-app/js/question.js";

// getting elements for quiz options, user inputs and displaying questions
const quizOptionsForm = document.querySelector('#quizOptions');
const playerNameInput = document.querySelector('#playerName');
const categoryInput = document.querySelector('#categoryMenu');
const difficultyOptions = document.querySelector('#difficultyOptions');
const questionsNumber = document.querySelector('#questionsNumber');
const startQuizBtn = document.querySelector('#startQuiz');
const questionsContainer = document.querySelector("#questionsContainer");
const loader = document.querySelector(".loading-overlay");

// variable for storing the incoming quiz
let currentQuiz = null;

// show loader
function showLoading() {
    loader.classList.remove('hidden');
};

// hide loader
function hideLoading() {
    loader.classList.add('hidden');
};

// function for getting error to display questions
function showError(message) {
    questionsContainer.innerHTML = message;
};

// function for validate the number of questions
function validateForm() {
    if (questionsNumber.value) {
        if (questionsNumber.value >= 1 && questionsNumber.value <= 50) {
            return {
                isValid: true,
                error: null
            };
        } else if (questionsNumber.value < 1) {
            return {
                isValid: false,
                error: '<i class="fa-solid fa-circle-exclamation"></i> Minimum 1 question required.',
            };
        } else if (questionsNumber.value > 50) {
            return {
                isValid: false,
                error: '<i class="fa-solid fa-circle-exclamation"></i> Maximum 50 questions allowed.',
            };
        };
    } else {
        return {
            isValid: false,
            error: '<i class="fa-solid fa-circle-exclamation"></i> Please enter the number of questions.'
        };
    };
};

// function for showing validation error
function showFormError(message) {
    const errorValid = document.querySelector(".form-error");
    errorValid.innerHTML = message;
    errorValid.classList.remove("hidden");
    function removeError() {
        errorValid.classList.add("hidden");
    };
    setTimeout(removeError, 3000);
};

// function for restart the quiz
function resetToStart() {
    questionsContainer.innerHTML = "";
    playerNameInput.value = "";
    categoryInput.value = "";
    difficultyOptions.value = "";
    questionsNumber.value = "";
    quizOptionsForm.classList.remove("hidden");
    currentQuiz = null;
};

// function for getting questions and display it
async function startQuiz() {

    // check validation form
    const formValidation = validateForm();
    if (!formValidation.isValid) {
        showFormError(formValidation.error);
        return;
    };

    // getting user values
    const playerName = playerNameInput.value ? playerNameInput.value : "Player";
    const category = categoryInput.value;
    const difficulty = difficultyOptions.value;
    const numberOfQuestions = questionsNumber.value;
    currentQuiz = new Quiz(category, difficulty, numberOfQuestions, playerName);
    quizOptionsForm.classList.add("hidden");
    showLoading();

    // sending options quiz's values to get the quiz's questions
    try {
      const questions = await currentQuiz.getQuestions();

      if (questions.length == 0)
        throw new Error(`<div class="game-card error-card">
      <div class="error-icon">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <h3 class="error-title">Oops! Something went wrong</h3>
      <p class="error-message">Failed to load questions. Please try again.</p>
      <button class="btn-play retry-btn">
        <i class="fa-solid fa-rotate-right"></i> Try Again
      </button>
    </div>`);
      hideLoading();
      const firstQuestion = new Question(currentQuiz, questionsContainer, resetToStart);
      firstQuestion.displayQuestion();
    } catch (error) {
        showError(error.message);
        const retryBtn = document.querySelector(".retry-btn");
        if (retryBtn) {
            retryBtn.addEventListener("click", resetToStart);
        }
    } finally {
        hideLoading();
    };
};

// adding event listener to start quiz by "start quiz" button or pressing "Enter" key
startQuizBtn.addEventListener("click", startQuiz);

questionsNumber.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        startQuiz();
    }
});
