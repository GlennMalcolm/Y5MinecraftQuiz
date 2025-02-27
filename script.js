// script.js - Complete Quiz Management System with Google Sheets Integration

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

// Your Google Script URL - REPLACE THIS WITH YOUR ACTUAL DEPLOYMENT URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwCs-hbHq8tl1MqczULratUFNFrnbDnRBXNy6Ryq407QykAAjNS4Blte1pFTMeXDsCvWQ/exec';

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

// Submit quiz using URL parameters (GET request) to avoid CORS issues
async function submitQuiz() {
    try {
        const studentName = sessionStorage.getItem('studentName');
        const studentClass = sessionStorage.getItem('studentClass');
        
        if (!studentName || !studentClass) {
            throw new Error('Student information not found');
        }
        
        // Collect all answers
        const answers = collectAnswers();
        
        // Format answers as a string
        let formattedAnswers = '';
        for (const [questionId, answer] of Object.entries(answers)) {
            if (Array.isArray(answer)) {
                // For checkbox questions (multiple answers)
                formattedAnswers += `${questionId}: ${answer.join(', ')}; `;
            } else {
                // For radio button and text questions
                formattedAnswers += `${questionId}: ${answer}; `;
            }
        }
        
        console.log('Preparing to submit quiz data:', {
            timestamp: new Date().toISOString(),
            studentName: studentName,
            studentClass: studentClass,
            answers: formattedAnswers
        });
        
        // Create a URL with query parameters
        const url = new URL(SCRIPT_URL);
        url.searchParams.append('timestamp', new Date().toISOString());
        url.searchParams.append('studentName', studentName);
        url.searchParams.append('studentClass', studentClass);
        url.searchParams.append('answers', formattedAnswers);
        
        console.log('Submitting to URL:', url.toString());
        
        // Create a form to submit (this approach often bypasses CORS issues)
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = SCRIPT_URL;
        form.target = '_blank'; // Open in new tab (which will close immediately)
        
        // Add form fields
        const addField = (name, value) => {
            const field = document.createElement('input');
            field.type = 'hidden';
            field.name = name;
            field.value = value;
            form.appendChild(field);
        };
        
        addField('timestamp', new Date().toISOString());
        addField('studentName', studentName);
        addField('studentClass', studentClass);
        addField('answers', formattedAnswers);
        
        // Add the form to the document, submit it, and remove it
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        console.log('Form submitted');
        
        // Show success message
        setTimeout(() => {
            alert('Quiz submitted successfully!');
            showQuizSummary({
                studentName: studentName,
                studentClass: studentClass
            });
        }, 1000);
        
    } catch (error) {
        console.error('Error submitting quiz:', error);
        alert('There was an error submitting your quiz. Please try again.');
    }
}

// Function to display a summary of the quiz
function showQuizSummary(quizData) {
    // Hide the quiz
    document.getElementById('quiz-page').classList.add('hidden');
    
    // Create a summary element if it doesn't exist
    let summaryElement = document.getElementById('quiz-summary');
    if (!summaryElement) {
        summaryElement = document.createElement('div');
        summaryElement.id = 'quiz-summary';
        summaryElement.className = 'quiz-container';
        document.body.appendChild(summaryElement);
    }
    
    // Build the summary content
    summaryElement.innerHTML = `
        <h1>Quiz Submitted!</h1>
        <p>Thank you, ${quizData.studentName} from ${quizData.studentClass}!</p>
        <p>Your answers have been recorded.</p>
        <button id="restart-btn" class="btn">Take Another Quiz</button>
    `;
    
    // Show the summary
    summaryElement.classList.remove('hidden');
    
    // Set up the restart button
    document.getElementById('restart-btn').addEventListener('click', function() {
        // Reset session storage
        sessionStorage.removeItem('studentName');
        sessionStorage.removeItem('studentClass');
        
        // Hide summary
        summaryElement.classList.add('hidden');
        
        // Show landing page
        document.getElementById('landing-page').classList.remove('hidden');
        
        // Reset form fields
        document.getElementById('student-name').value = '';
        document.getElementById('class-selection').selectedIndex = 0;
        
        // Reset all question inputs
        resetQuizInputs();
    });
}

// Function to reset all quiz inputs
function resetQuizInputs() {
    for (let i = 1; i <= totalQuestions; i++) {
        // Reset radio buttons
        const radioButtons = document.querySelectorAll(`input[name="q${i}"][type="radio"]`);
        radioButtons.forEach(radio => radio.checked = false);
        
        // Reset checkboxes
        const checkboxes = document.querySelectorAll(`input[name="q${i}"][type="checkbox"]`);
        checkboxes.forEach(checkbox => checkbox.checked = false);
        
        // Reset text inputs
        const textInputs = document.querySelectorAll(`input[name="q${i}"][type="text"], input[name="q${i}"][type="number"]`);
        textInputs.forEach(input => input.value = '');
    }
}
