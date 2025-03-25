class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 600;
        this.canvas.height = 600;
        this.gridSize = 30;
        this.snake = [];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.food = null;
        this.score = 0;
        this.gameTime = 0;
        this.gameLoop = null;
        this.isGameOver = false;
        this.difficulty = 'normal';
        this.speeds = {
            'easy': 150,
            'normal': 100,
            'hard': 50
        };
        this.points = {
            'easy': 1,
            'normal': 2,
            'hard': 3
        };

        // Load assets
        this.loadAssets();
        
        // Initialize event listeners
        this.initializeEventListeners();
    }

    loadAssets() {
        // Load images
        this.snakeHead = new Image();
        this.snakeBody = new Image();
        this.foodImg = new Image();
        this.snakeHead.src = 'img/snake.png';
        this.snakeBody.src = 'img/body.png';
        this.foodImg.src = 'img/monster.png';

        // Load sounds
        this.eatSound = new Audio('mp3/eat.mp3');
        this.gameOverSound = new Audio('mp3/over.mp3');
    }

    initializeEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
    }

    handleKeyPress(e) {
        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        if (directions[e.key]) {
            const newDirection = directions[e.key];
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };

            if (this.direction !== opposites[newDirection]) {
                this.nextDirection = newDirection;
            }
        }
    }

    startGame() {
        // Reset game state
        this.snake = [
            { x: 6, y: 10 },
            { x: 5, y: 10 },
            { x: 4, y: 10 }
        ];
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameTime = 0;
        this.isGameOver = false;
        this.updateScore();
        
        // Generate initial food
        this.generateFood();

        // Clear previous game loop
        if (this.gameLoop) clearInterval(this.gameLoop);

        // Start new game loop
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, this.speeds[this.difficulty]);

        // Start timer
        this.startTimer();
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * (this.canvas.width / this.gridSize)),
                y: Math.floor(Math.random() * (this.canvas.height / this.gridSize))
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        
        this.food = newFood;
    }

    update() {
        if (this.isGameOver) return;

        // Update direction
        this.direction = this.nextDirection;

        // Calculate new head position
        const head = { ...this.snake[0] };
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check collision with walls
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver();
            return;
        }

        // Check collision with self
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }

        // Add new head
        this.snake.unshift(head);

        // Check if food is eaten
        if (head.x === this.food.x && head.y === this.food.y) {
            this.eatSound.play();
            this.score += this.points[this.difficulty];
            this.updateScore();
            this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.snake.forEach((segment, index) => {
            const img = index === 0 ? this.snakeHead : this.snakeBody;
            this.ctx.save();
            if (index === 0) {
                this.ctx.translate(segment.x * this.gridSize + this.gridSize / 2, 
                                 segment.y * this.gridSize + this.gridSize / 2);
                switch (this.direction) {
                    case 'up': this.ctx.rotate(-Math.PI/2); break;
                    case 'down': this.ctx.rotate(Math.PI/2); break;
                    case 'left': this.ctx.rotate(Math.PI); break;
                    case 'right': this.ctx.rotate(0); break;
                }
                this.ctx.translate(-this.gridSize / 2, -this.gridSize / 2);
                this.ctx.drawImage(img, 0, 0, this.gridSize, this.gridSize);
            } else {
                this.ctx.drawImage(img, segment.x * this.gridSize, 
                                      segment.y * this.gridSize, 
                                      this.gridSize, this.gridSize);
            }
            this.ctx.restore();
        });

        // Draw food
        this.ctx.drawImage(this.foodImg, this.food.x * this.gridSize, 
                                       this.food.y * this.gridSize, 
                                       this.gridSize, this.gridSize);
    }

    gameOver() {
        this.isGameOver = true;
        this.gameOverSound.play();
        clearInterval(this.gameLoop);
        this.updateLeaderboard();
        
        // Draw game over message
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束!', this.canvas.width/2, this.canvas.height/2);
        this.ctx.font = '24px Arial';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width/2, this.canvas.height/2 + 40);
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('score').classList.add('score-update');
        setTimeout(() => {
            document.getElementById('score').classList.remove('score-update');
        }, 300);
    }

    startTimer() {
        this.gameTime = 0;
        const timerElement = document.getElementById('gameTime');
        const timer = setInterval(() => {
            if (!this.isGameOver) {
                this.gameTime++;
                timerElement.textContent = this.gameTime;
            } else {
                clearInterval(timer);
            }
        }, 1000);
    }

    updateLeaderboard() {
        let leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
        leaderboard.push({
            score: this.score,
            difficulty: this.difficulty,
            time: this.gameTime
        });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);
        localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
        this.displayLeaderboard();
    }

    displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('snakeLeaderboard') || '[]');
        const leaderboardElement = document.getElementById('leaderboardList');
        leaderboardElement.innerHTML = '';
        
        leaderboard.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'leaderboard-item';
            item.innerHTML = `
                <span>#${index + 1}</span>
                <span>${entry.score}分</span>
            `;
            leaderboardElement.appendChild(item);
        });
    }
}

// Initialize game when window loads
window.addEventListener('load', () => {
    const game = new SnakeGame();
    game.displayLeaderboard();
}); 