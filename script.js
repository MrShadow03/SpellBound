let words = {};
let currentWord = null;
let correctAnswerGiven = false;
const actionButton = document.getElementById('action-button');

// Load words from JSON file
async function loadWords() {
    const response = await fetch('personal.json');
    words = await response.json();
    
    // Initialize practice scores in localStorage if not already set
    initializePracticeScores();
    loadFirstWord();

    localStorage.setItem('remaining-repetitions', 0);
    localStorage.setItem('incorrect-attempts', 0);
}

// Initialize practice scores for each word in localStorage
function initializePracticeScores() {
    Object.keys(words).forEach(letter => {
        words[letter].forEach(wordObj => {
            const wordKey = `${wordObj.correct.toLowerCase()}`;
            if (!localStorage.getItem(wordKey)) {
                localStorage.setItem(wordKey, 1); // Set initial score to 1 for each word
            }
        });
    });
}

document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        // Add multiple classes
        actionButton.classList.add('bg-gray-900', 'text-gray-100', 'ease-in');
        
        setTimeout(function() {
            // Remove multiple classes
            actionButton.classList.remove('bg-gray-900', 'text-gray-100', 'ease-in');
        }, 150);

        goToNextStep();
    }
});


function goToNextStep(){
    if(correctAnswerGiven) {
        nextWord();
        return
    }
    checkAnswer();
}

function loadFirstWord() {
    currentWord = getWeightedRandomWord();
    displayCurrentWord();
}

function nextWord() {
    correctAnswerGiven = false;
    let remainingRepetition = parseInt(localStorage.getItem('remaining-repetitions') || 0);
    
    if (remainingRepetition > 0) {
        localStorage.setItem('remaining-repetitions', remainingRepetition - 1);
    } else {
        localStorage.setItem('incorrect-attempts', 0);
        currentWord = getWeightedRandomWord();
    }
    
    displayCurrentWord();
}

function getWeightedRandomWord() {
    // Build a list of all words with weights based on practice score
    const weightedWords = [];
    Object.keys(words).forEach(letter => {
        words[letter].forEach(wordObj => {
            const wordKey = wordObj.correct.toLowerCase();
            const score = parseInt(localStorage.getItem(wordKey) || 1);
            // Lower scores mean higher frequency in weightedWords array
            for (let i = 0; i < 10 - score; i++) {
                weightedWords.push(wordObj);
            }
        });
    });
    
    // Choose a random word from weighted list
    return weightedWords[Math.floor(Math.random() * weightedWords.length)];
}

function displayCurrentWord() {
    resetFeedback();
    document.getElementById('incorrect-word').innerText = `${currentWord.incorrect}`;
    document.getElementById('incorrect-word').href = `https://www.merriam-webster.com/dictionary/${currentWord.correct}`;
    document.getElementById('definition').innerText = `${currentWord.definition || ''}`;
    document.getElementById('part-of-speech').innerText = `${currentWord.partOfSpeech || ''}`;
    document.getElementById('feedback').innerText = '';
    document.getElementById('user-input').value = '';
}

function checkAnswer() {
    const userInput = document.getElementById('user-input').value.trim().toLowerCase();
    const feedback = document.getElementById('feedback');
    const wordKey = currentWord.correct.toLowerCase();
    let score = parseInt(localStorage.getItem(wordKey) || 1);

    if(userInput.trim() === ''){
        feedback.textContent = 'Spell the word dude, 😒!';
        return;
    }

    resetFeedback();
    
    if (userInput === currentWord.correct.toLowerCase()) {
        document.getElementById('correct-icon').classList.remove('hidden');
        feedback.textContent = 'Correct!';
        feedback.classList.add('text-green-500');
        feedback.classList.remove('text-red-500');

        // Increment practice score in localStorage for the current word

        
        correctAnswerGiven = true;
        console.log('checking answer');
        localStorage.setItem(wordKey, Math.min(score + 1, 9)); // Max score of 9

    } else {
        document.getElementById('incorrect-icon').classList.remove('hidden');
        feedback.textContent = `Don't worry, Practice it!`;
        feedback.classList.add('text-red-500');
        feedback.classList.remove('text-green-500');

        saveIncorrect(currentWord);

        let incorrectAttempts = parseInt(localStorage.getItem('incorrect-attempts') || 0);
        localStorage.setItem('incorrect-attempts', incorrectAttempts + 1);

        correctAnswerGiven = false;
        localStorage.setItem(wordKey, Math.max(score - 1, 1));

        if (incorrectAttempts >= 0) {
            document.getElementById('syllable').innerText = currentWord.syllable || currentWord.correct;
            document.getElementById('syllable').classList.remove('hidden');
            localStorage.setItem('incorrect-attempts', 0);
            startPractice();
        }
    }
}

function startPractice() {
    localStorage.setItem('remaining-repetitions', 3);
}

function resetFeedback() {
    document.getElementById('incorrect-icon').classList.add('hidden');
    document.getElementById('correct-icon').classList.add('hidden');
    document.getElementById('syllable').classList.add('hidden');
}

function saveIncorrect(word) {
    const incorrectWords = JSON.parse(localStorage.getItem('incorrectWords') || '[]');
    incorrectWords.push(word);
    localStorage.setItem('incorrectWords', JSON.stringify(incorrectWords));
}

loadWords();
