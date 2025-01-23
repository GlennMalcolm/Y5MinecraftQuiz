// script.js - Complete Quiz Management System

// State Management Variables
let currentQuestion = 1;        // Tracks current question number (1-25)
let currentChapter = 1;         // Tracks current chapter (1-5)
const totalQuestions = 25;      // Total questions across all chapters
const questionsPerChapter = 5;  // Number of questions in each chapter

// Chapter Information Object
const chapterTitles = {
    1: "Introduction to Agent Coding",
    2: "Coding Events and Repeats",
    3: "Events, Loops, and Conditionals",
    4: "Nested Loops",
    5: "Conditionals with Grey Wolves"
};

// Initialize everything when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    // Set up the start quiz button functionality
    const startButton = document.getElementById('start-quiz-btn');
    if (startButton) {
        console.log('Start button found');
        startButton.addEventListener('click', handleQuizStart);
    } else {
        console.error('Start button not found');
    }

    // Set up navigation button event listeners
    setupNavigationButtons();
    
    // Set up keyboard navigation
    setupKeyboardNavigation();

    // Initialize first question if quiz is already in progress
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        console.log('Quiz page is visible, initializing first question');
        showQuestion(1);
    }
});

// Function to handle the start of the quiz
function handleQuizStart() {
    console.log('Start quiz button clicked');

    const name = document.getElementById('student-name').value;
    const selectedClass = document.getElementById('class-selection').value;
    
    // Validate input
    if (name.trim() === "" || !selectedClass) {
        alert("Please enter your name and select your class.");
        return;
    }

    // Store student information for later use
    sessionStorage.setItem('studentName', name);
    sessionStorage.setItem('studentClass', selectedClass);

    // Transition to quiz interface
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('quiz-page').classList.remove('hidden');
    
    // Start with first question
    currentQuestion = 1;
    currentChapter = 1;
    showQuestion(1);
    updateChapterDisplay();
}

// Set up navigation button event listeners
function setupNavigationButtons() {
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    
    if (nextButton) {
        nextButton.addEventListener('click', nextQuestion);
    } else {
        console.error('Next button not found');
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', previousQuestion);
    } else {
        console.error('Previous button not found');
    }
}

// Set up keyboard navigation
function setupKeyboardNavigation() {
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
}

// Function to display a specific question and update UI
function showQuestion(questionNumber) {
    console.log('Showing question:', questionNumber);
    
    // Calculate current chapter
    currentChapter = Math.ceil(questionNumber / questionsPerChapter);
    
    // Hide all questions
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => q.style.display = 'none');
    
    // Show current question
    const currentQuestionElement = document.getElementById(`q${questionNumber}`);
    if (currentQuestionElement) {
        currentQuestionElement.style.display = 'block';
        console.log('Question displayed successfully');
    } else {
        console.error('Question element not found:', questionNumber);
    }
    
    // Update UI elements
    updateProgress();
    updateChapterDisplay();
    updateNavigationButtons();
}

// Update the progress bar and text
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    if (progressFill && progressText) {
        const progressPercentage = (currentQuestion / totalQuestions) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        progressText.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
    } else {
        console.error('Progress elements not found');
    }
}

// Update chapter title and information
function updateChapterDisplay() {
    const chapterTitle = document.getElementById('chapter-title');
    const chapterIndicator = document.getElementById('current-chapter');
    
    if (chapterTitle) {
        chapterTitle.textContent = `Chapter ${currentChapter}: ${chapterTitles[currentChapter]}`;
    } else {
        console.error('Chapter title element not found');
    }
    
    if (chapterIndicator) {
        chapterIndicator.textContent = currentChapter;
    } else {
        console.error('Chapter indicator element not found');
    }
}

// Update navigation button states
function updateNavigationButtons() {
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');
    
    if (prevButton) {
        prevButton.disabled = currentQuestion === 1;
    } else {
        console.error('Previous button not found');
    }
    
    if (nextButton) {
        nextButton.textContent = currentQuestion === totalQuestions ? 'Submit Quiz' : 'Next';
    } else {
        console.error('Next button not found');
    }
}

// Handle navigation to next question
function nextQuestion() {
    console.log('Current question:', currentQuestion);
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showQuestion(currentQuestion);
    } else if (currentQuestion === totalQuestions) {
        if (confirm('Are you ready to submit your quiz?')) {
            submitQuiz();
        }
    }
}

// Handle navigation to previous question
function previousQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Collect all answers from the quiz
function collectAnswers() {
    const answers = {};
    for (let i = 1; i <= totalQuestions; i++) {
        if (document.querySelector(`input[name="q${i}"]`)) {
            if (document.querySelector(`input[name="q${i}"][type="radio"]`)) {
                // Handle radio button questions
                answers[`q${i}`] = document.querySelector(`input[name="q${i}"]:checked`)?.value || '';
            } else if (document.querySelector(`input[name="q${i}"][type="checkbox"]`)) {
                // Handle checkbox questions
                answers[`q${i}`] = Array.from(document.querySelectorAll(`input[name="q${i}"]:checked`))
                    .map(cb => cb.value);
            } else {
                // Handle text input questions
                answers[`q${i}`] = document.querySelector(`input[name="q${i}"]`).value;
            }
        }
    }
    return answers;
}

// Handle quiz submission
function submitQuiz() {
    try {
        const studentName = sessionStorage.getItem('studentName');
        const studentClass = sessionStorage.getItem('studentClass');
        
        // Prepare quiz data for submission
        const quizData = {
            studentName: studentName,
            studentClass: studentClass,
            timestamp: new Date().toISOString(),
            answers: collectAnswers()
        };

        // Convert to JSON for Firebase
        const jsonData = JSON.stringify(quizData);
        
        // Log submission data and show success message
        console.log('Quiz data ready for submission:', jsonData);
        alert('Quiz submitted successfully!');
        
        // TODO: Implement actual Firebase submission here
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('There was an error submitting your quiz. Please try again.');
    }
}
