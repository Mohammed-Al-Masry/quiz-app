# QuizMaster

QuizMaster is a dynamic and engaging web-based trivia application that challenges your knowledge across a variety of categories. Built with JavaScript, HTML, and CSS, this project demonstrates modern web development techniques, including API integration, DOM manipulation, and local storage management.

## Features

- **Customizable Quizzes**: Tailor your trivia experience by selecting the category, difficulty level (Easy, Medium, Hard), and the number of questions.
- **Live API Integration**: Questions are fetched in real-time from the [Open Trivia Database API](https://opentdb.com/).
- **Interactive Gameplay**: Each question is presented with a 30-second timer to keep the challenge exciting.
- **Instant Feedback**: Get immediate visual feedback on your answers (correct or incorrect).
- **Score Tracking**: Your score is tracked throughout the quiz.
- **High Score Leaderboard**: The application saves the top 10 high scores in your browser's local storage, allowing you to compete against yourself and others.
- **Responsive Design**: A clean and intuitive interface that works on different screen sizes.

## How to Play

1.  Simply open the `index.html` file in any modern web browser.
2.  On the setup screen, you can (optionally) enter your name.
3.  Select your desired quiz category, difficulty, and the number of questions.
4.  Click the "Start Game" button.
5.  Answer each question before the timer runs out!
6.  After the quiz is complete, your score will be displayed, and if you've made it to the top 10, your score will be saved to the leaderboard.

## Project Structure

```
Quiz-App/
├── CSS/
│   └── style.css         # Main stylesheet for the application
├── images/
│   └── favicon.png       # Favicon for the application
├── js/
│   ├── index.js          # Main application logic, event handling, and initialization
│   ├── question.js       # Defines the Question class for displaying and managing a single question
│   ├── quiz.js           # Defines the Quiz class for managing the overall quiz state, fetching questions, and handling scoring
│   └── ui-controls.js    # Handles UI enhancements like custom select menus
└── index.html            # The main HTML file for the application
```

### File Descriptions

-   **`index.html`**: The main entry point of the application. It contains the structure for the setup screen, the quiz container, and the results display.
-   **`CSS/style.css`**: Provides all the styling for the application, including layout, colors, fonts, and animations.
-   **`js/index.js`**: Acts as the controller, orchestrating the application flow. It handles user input from the setup form, initiates the quiz, and manages the overall state transitions.
-   **`js/quiz.js`**: The core model for the quiz. This file contains the `Quiz` class, which is responsible for fetching questions from the API, tracking the score, managing the question sequence, and handling the end-of-quiz logic, including the high score leaderboard.
-   **`js/question.js`**: Contains the `Question` class, which manages the rendering and logic for an individual question. This includes displaying the question and answers, handling the timer, checking the user's answer, and providing visual feedback.
-   **`js/ui-controls.js`**: A utility script for enhancing UI elements, such as creating custom dropdown menus for the setup form.

This project was built with a focus on clean, modular, and object-oriented JavaScript.
