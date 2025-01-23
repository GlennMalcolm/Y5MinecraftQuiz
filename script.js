// Quiz state management
let currentQuestion = 1;
const totalQuestions = 25;
const questionsPerChapter = 5;

// Store student information
let studentName = '';
let studentClass = '';

// Function to validate user input when starting the quiz
function validateUserInput(name, selectedClass) {
    if (name.trim() === "" || !selectedClass) {
        alert("Please enter your name and select your class.");
        return false;
    }
    return true;
}

// Main function to display questions and update UI
function showQuestion(questionNumber) {
    // First hide all questions
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => {
        q.style.display = 'none';
    });
    
    // Show the current question
    const currentQuestionElement = document.getElementById(`q${questionNumber}`);
    if (currentQuestionElement) {
        currentQuestionElement.style.display = 'block';
    }
    
    // Calculate current chapter
    const currentChapter = Math.ceil(questionNumber / questionsPerChapter);
    
    // Update chapter title
    updateChapterTitle(currentChapter);
    
    // Update progress indicators
    updateProgress(questionNumber);
    
    // Update navigation buttons
    updateNavigationButtons(questionNumber);
}

// Handle chapter titles
function updateChapterTitle(chapterNumber) {
    const chapterTitles = {
        1: "Introduction to Agent Coding",
        2: "Coding Events and Repeats",
        3: "Events, Loops, and Conditionals",
        4: "Nested Loops",
        5: "Conditionals with Grey Wolves"
    };
    
    const titleElement = document.getElementById('chapter-title');
    if (titleElement) {
        titleElement.textContent = `Chapter ${chapterNumber}: ${chapterTitles[chapterNumber]}`;
    }
}

// Handle progress bar and text updates
function updateProgress(questionNumber) {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    const progressPercentage = (questionNumber / totalQuestions) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `Question ${questionNumber} of ${totalQuestions}`;
}

// Update navigation button states
function updateNavigationButtons(questionNumber) {
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');
    
    prevButton.disabled = questionNumber === 1;
    nextButton.textContent = questionNumber === totalQuestions ? 'Submit' : 'Next';
}

// Navigation functions
function nextQuestion() {
    console.log('Moving to next question from:', currentQuestion);
    
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
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
