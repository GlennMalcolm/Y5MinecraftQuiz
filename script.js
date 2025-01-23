// At the beginning of script.js
let currentQuestion = 1;
const totalQuestions = 25;

// Add event listeners when the document loads
document.addEventListener('DOMContentLoaded', function() {
    // Add navigation button listeners
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
    
    // Initialize first question if quiz is active
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        showQuestion(1);
    }
    
    // Add quiz start button listener
    document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
});

function showQuestion(questionNumber) {
    console.log('Showing question:', questionNumber); // Debug log
    
    // Hide all questions
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.style.display = 'none');
    
    // Show current question
    const currentQuestionElement = document.getElementById(`q${questionNumber}`);
    if (currentQuestionElement) {
        currentQuestionElement.style.display = 'block';
        console.log('Displayed question:', questionNumber);
    } else {
        console.log('Question element not found:', questionNumber);
    }
    
    // Update progress and buttons
    updateProgress();
    updateNavigationButtons();
}

function nextQuestion() {
    console.log('Current question before next:', currentQuestion); // Debug log
    
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        console.log('Moving to question:', currentQuestion); // Debug log
        showQuestion(currentQuestion);
    } else if (currentQuestion === totalQuestions) {
        if (confirm('Are you ready to submit your quiz?')) {
            submitQuiz();
        }
    }
}

function previousQuestion() {
    console.log('Moving to previous question from:', currentQuestion);
    
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Collect all answers from the quiz
function collectAnswers() {
    const answers = {};
    
    // Loop through all questions
    for (let i = 1; i <= totalQuestions; i++) {
        const questionType = getQuestionType(i);
        
        switch (questionType) {
            case 'radio':
                answers[`q${i}`] = document.querySelector(`input[name="q${i}"]:checked`)?.value || '';
                break;
            case 'checkbox':
                answers[`q${i}`] = Array.from(document.querySelectorAll(`input[name="q${i}"]:checked`))
                    .map(cb => cb.value);
                break;
            case 'text':
                answers[`q${i}`] = document.querySelector(`input[name="q${i}"]`)?.value || '';
                break;
        }
    }
    
    return answers;
}

// Determine question type based on question number
function getQuestionType(questionNumber) {
    // Add logic to determine question type based on question number
    const textQuestions = [2, 5, 7, 10, 12, 15, 18, 20, 24, 25];
    const checkboxQuestions = [4, 9, 14, 19, 23];
    
    if (textQuestions.includes(questionNumber)) return 'text';
    if (checkboxQuestions.includes(questionNumber)) return 'checkbox';
    return 'radio';
}

// Handle quiz submission
function submitQuiz() {
    const answers = collectAnswers();
    
    // Prepare data for submission
    const quizData = {
        studentName: studentName,
        studentClass: studentClass,
        answers: answers,
        timestamp: new Date().toISOString(),
        totalQuestions: totalQuestions
    };
    
    console.log('Submitting quiz data:', quizData);
    
    // TODO: Implement Firebase submission
    alert('Quiz submitted! Thank you for completing the quiz.');
}

// Initialize quiz when starting
document.getElementById('start-quiz-btn').addEventListener('click', function () {
    const nameInput = document.getElementById('student-name');
    const classSelect = document.getElementById('class-selection');
    
    if (validateUserInput(nameInput.value, classSelect.value)) {
        // Store student information
        studentName = nameInput.value;
        studentClass = classSelect.value;
        
        // Hide landing page and show quiz
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('quiz-page').classList.remove('hidden');
        
        // Initialize first question
        currentQuestion = 1;
        showQuestion(1);
    }
});

// Set up quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    // If quiz page is visible (not hidden), show first question
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        showQuestion(1);
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Only handle keypresses if quiz is active
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        switch (event.key) {
            case 'ArrowRight':
            case 'Enter':
                nextQuestion();
                break;
            case 'ArrowLeft':
                previousQuestion();
                break;
        }
    }
});
