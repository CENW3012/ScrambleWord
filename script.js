class ScrambleGame {
    constructor() {
        this.words = [
            {
                word: "HADOOP",
                clue: "Big data processing framework"
            },
            {
                word: "SUPERSET",
                clue: "Apache data visualization platform"
            },
            {
                word: "LATENCY",
                clue: "Time delay in data transmission"
            },
            {
                word: "THROUGHPUT",
                clue: "Amount of data processed in given time"
            },
            {
                word: "STORM",
                clue: "Real-time computation system"
            },
            {
                word: "ACTIVATION",
                clue: "A function that determines a neuron's output"
            },
            {
                word: "HIDDEN LAYER",
                clue: "The 'deep' in deep learning"
            },
            {
                word: "SIGMOID",
                clue: "An S-shaped activation function"
            },
            {
                word: "AGGREGATION",
                clue: "The process of summing weighted inputs"
            },
            {
                word: "NETWORK",
                clue: "A connected assembly of neurons"
            }
        ];
        
        this.currentWordIndex = 0;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.soundEnabled = true;
        
        // Audio elements
        this.backgroundMusic = document.getElementById('background-music');
        this.winSound = document.getElementById('win-sound');
        this.loseSound = document.getElementById('lose-sound');
        
        // DOM elements
        this.clueElement = document.getElementById('clue');
        this.scrambledWordElement = document.getElementById('scrambled-word');
        this.userInput = document.getElementById('user-input');
        this.submitBtn = document.getElementById('submit-btn');
        this.hintBtn = document.getElementById('hint-btn');
        this.skipBtn = document.getElementById('skip-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.soundBtn = document.getElementById('sound-btn');
        this.feedbackElement = document.getElementById('feedback');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.levelElement = document.getElementById('level');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.forceAudioPlay();
        this.startNewGame();
    }
    
    setupEventListeners() {
        this.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.hintBtn.addEventListener('click', () => this.giveHint());
        this.skipBtn.addEventListener('click', () => this.skipWord());
        this.resetBtn.addEventListener('click', () => this.startNewGame());
        this.soundBtn.addEventListener('click', () => this.toggleSound());
        
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
    }
    
    forceAudioPlay() {
        this.backgroundMusic.volume = 0.3;
        this.winSound.volume = 0.7;
        this.loseSound.volume = 0.7;
        
        const playAudio = () => {
            if (this.soundEnabled) {
                this.backgroundMusic.play().catch(error => {
                    console.log('Autoplay blocked');
                });
            }
        };
        
        if (document.readyState === 'complete') {
            playAudio();
        } else {
            window.addEventListener('load', playAudio);
        }
    }
    
    startNewGame() {
        this.currentWordIndex = 0;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.updateDisplay();
        this.loadWord();
        this.userInput.focus();
    }
    
    scrambleWord(word) {
        const wordArray = word.split('');
        for (let i = wordArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
        }
        const scrambled = wordArray.join('');
        return scrambled === word ? this.scrambleWord(word) : scrambled;
    }
    
    loadWord() {
        if (this.currentWordIndex >= this.words.length) {
            this.gameWon();
            return;
        }
        
        const currentWordObj = this.words[this.currentWordIndex];
        const scrambled = this.scrambleWord(currentWordObj.word.toUpperCase());
        
        this.clueElement.textContent = currentWordObj.clue;
        this.scrambledWordElement.textContent = scrambled;
        this.userInput.value = '';
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'feedback';
        
        this.updateProgress();
    }
    
    checkAnswer() {
        const userAnswer = this.userInput.value.trim().toUpperCase();
        const correctAnswer = this.words[this.currentWordIndex].word.toUpperCase();
        
        if (userAnswer === correctAnswer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }
    
    handleCorrectAnswer() {
        this.score += 10 * this.level;
        this.feedbackElement.textContent = '✅ Correct! Well done!';
        this.feedbackElement.className = 'feedback correct';
        this.scrambledWordElement.classList.add('pulse');
        
        if (this.soundEnabled) {
            this.winSound.currentTime = 0;
            this.winSound.play();
        }
        
        setTimeout(() => {
            this.scrambledWordElement.classList.remove('pulse');
            this.currentWordIndex++;
            if (this.currentWordIndex % 3 === 0 && this.level < 5) {
                this.level++;
            }
            this.loadWord();
        }, 1500);
    }
    
    handleIncorrectAnswer() {
        this.lives--;
        this.feedbackElement.textContent = `❌ Incorrect! The answer was: ${this.words[this.currentWordIndex].word}`;
        this.feedbackElement.className = 'feedback incorrect';
        this.scrambledWordElement.classList.add('shake');
        
        if (this.soundEnabled) {
            this.loseSound.currentTime = 0;
            this.loseSound.play();
        }
        
        setTimeout(() => {
            this.scrambledWordElement.classList.remove('shake');
            if (this.lives <= 0) {
                this.gameOver();
            } else {
                this.currentWordIndex++;
                this.loadWord();
            }
        }, 2000);
    }
    
    giveHint() {
        const word = this.words[this.currentWordIndex].word;
        const hint = word.substring(0, Math.ceil(word.length / 2));
        this.feedbackElement.textContent = `💡 Hint: Starts with "${hint}..."`;
        this.feedbackElement.className = 'feedback';
        this.score = Math.max(0, this.score - 5);
        this.updateDisplay();
    }
    
    skipWord() {
        this.feedbackElement.textContent = `⏭️ Skipped! The word was: ${this.words[this.currentWordIndex].word}`;
        this.feedbackElement.className = 'feedback';
        this.currentWordIndex++;
        this.loadWord();
    }
    
    gameOver() {
        this.feedbackElement.textContent = `💀 Game Over! Final Score: ${this.score}`;
        this.feedbackElement.className = 'feedback incorrect';
        this.disableInput();
    }
    
    gameWon() {
        this.feedbackElement.textContent = `🎉 Congratulations! You won! Final Score: ${this.score}`;
        this.feedbackElement.className = 'feedback correct';
        this.disableInput();
        
        if (this.soundEnabled) {
            this.winSound.play();
        }
    }
    
    disableInput() {
        this.userInput.disabled = true;
        this.submitBtn.disabled = true;
        this.hintBtn.disabled = true;
        this.skipBtn.disabled = true;
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundEnabled) {
            this.soundBtn.textContent = '🔊 Sound On';
            this.backgroundMusic.play();
        } else {
            this.soundBtn.textContent = '🔇 Sound Off';
            this.backgroundMusic.pause();
        }
    }
    
    updateDisplay() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
        this.levelElement.textContent = this.level;
    }
    
    updateProgress() {
        const progress = (this.currentWordIndex / this.words.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${this.currentWordIndex}/${this.words.length}`;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ScrambleGame();
});

// Last resort audio enable
document.addEventListener('click', function enableAudio() {
    const bgMusic = document.getElementById('background-music');
    if (bgMusic.paused) {
        bgMusic.play().catch(e => console.log('Audio enable failed'));
    }
    document.removeEventListener('click', enableAudio);
});
