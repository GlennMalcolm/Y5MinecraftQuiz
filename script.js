// Initialize quiz state variables
let currentQuestion = 1;
const totalQuestions = 5;

// Validate user input when starting the quiz
function validateUserInput(name, selectedClass) {
    if (name.trim() === "" || !selectedClass) {
        alert("Please enter your name and select your class.");
        return false;
    }
    return true;
}

// Function to display a specific question and update UI accordingly
function showQuestion(questionNumber) {
    console.log('Showing question:', questionNumber); // Debug log
    
    // First hide all questions
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => {
        q.style.display = 'none';
    });
    
    // Show the requested question
    const currentQuestionElement = questions[questionNumber - 1];
    if (currentQuestionElement) {
        currentQuestionElement.style.display = 'block';
    }
    
    // Update the progress indicators
    updateProgress();
    
    // Update navigation button states
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');
    
    // Disable previous button on first question
    prevButton.disabled = questionNumber === 1;
    
    // Change next button to submit on last question
    if (questionNumber === totalQuestions) {
        nextButton.textContent = 'Submit';
    } else {
        nextButton.textContent = 'Next';
    }
}

// Handle next button clicks
function nextQuestion() {
    console.log('Current question:', currentQuestion); // Debug log
    
    if (currentQuestion === totalQuestions) {
        // On last question, show submission confirmation
        if (confirm('Are you ready to submit your quiz?')) {
            submitQuiz();
        }
    } else {
        // Move to next question
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

// Handle previous button clicks
function previousQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// Update progress bar and text
function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    // Calculate and update progress percentage
    const progressPercentage = (currentQuestion / totalQuestions) * 100;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
}

// Handle quiz submission
function submitQuiz() {
    // Collect all answers
    const answers = {
        q1: document.querySelector('input[name="q1"]:checked')?.value || '',
        q2: document.querySelector('input[name="q2"]').value,
        q3: document.querySelector('input[name="q3"]:checked')?.value || '',
        q4: Array.from(document.querySelectorAll('input[name="q4"]:checked')).map(cb => cb.value),
        q5: document.querySelector('input[name="q5"]').value
    };
    
    console.log('Submitting answers:', answers);
    
    // TODO: Implement Firebase submission
    alert('Quiz submitted! Thank you for completing the quiz.');
}

// Initialize quiz when starting
document.getElementById('start-quiz-btn').addEventListener('click', function () {
    const name = document.getElementById('student-name').value;
    const selectedClass = document.getElementById('class-selection').value;

    if (validateUserInput(name, selectedClass)) {
        // Hide landing page and show quiz
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('quiz-page').classList.remove('hidden');
        
        // Initialize first question
        currentQuestion = 1;
        showQuestion(1);
        updateProgress();
    }
});

// Set up quiz when page loads
document.addEventListener('DOMContentLoaded', function() {
    // If quiz page is visible (not hidden), show first question
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        showQuestion(1);
    }
});

// Add keypress support for navigation (optional enhancement)
document.addEventListener('keydown', function(event) {
    // Only handle keypresses if quiz is active
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        if (event.key === 'ArrowRight' || event.key === 'Enter') {
            nextQuestion();
        } else if (event.key === 'ArrowLeft') {
            previousQuestion();
        }
    }
});
