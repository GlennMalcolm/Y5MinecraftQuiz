let currentQuestion = 1;
const totalQuestions = 5;

function validateUserInput(name, selectedClass) {
    if (name.trim() === "" || !selectedClass) {
        alert("Please enter your name and select your class.");
        return false;
    }
    return true;
}

function showQuestion(questionNumber) {
    const questions = document.querySelectorAll('.question');
    questions.forEach(q => {
        q.classList.remove('active');
    });
    
    questions[questionNumber - 1].classList.add('active');
    
    updateProgress();
    
    document.getElementById('prevBtn').disabled = questionNumber === 1;
    document.getElementById('nextBtn').innerHTML = questionNumber === totalQuestions ? 'Submit' : 'Next';
}

function nextQuestion() {
    if (currentQuestion === totalQuestions) {
        if (confirm('Are you ready to submit your quiz?')) {
            submitQuiz();
        }
    } else {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

function previousQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

function updateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    const progressPercentage = (currentQuestion / totalQuestions) * 100;
    progressFill.style.width = progressPercentage + '%';
    progressText.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
}

function submitQuiz() {
    // TODO: Implement quiz submission to Firebase
    console.log('Submitting quiz...');
    // For now, just show an alert
    alert('Quiz submitted! Thank you for completing the quiz.');
}

document.getElementById('start-quiz-btn').addEventListener('click', function () {
    const name = document.getElementById('student-name').value;
    const selectedClass = document.getElementById('class-selection').value;

    if (validateUserInput(name, selectedClass)) {
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('quiz-page').classList.remove('hidden');
        currentQuestion = 1;
        showQuestion(1);
        updateProgress();
    }
});

// Initialize the first question when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('quiz-page').classList.contains('hidden')) {
        showQuestion(1);
    }
});
