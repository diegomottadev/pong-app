// Import necessary modules and components from Angular
import {
  Component,
  OnInit,
  HostListener,
} from '@angular/core';

import { GameService } from './game-board.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-game-board', // Selector for the component
  standalone: true, // Indicates that this component is standalone
  imports: [], // Import statements for the component
  templateUrl: './game-board.component.html', // Template for the component
  styleUrl: './game-board.component.css', // Styles for the component
})
export class GameBoardComponent implements OnInit {
  canvas: HTMLCanvasElement | null = null; // Reference to the canvas element
  ctx: CanvasRenderingContext2D | null = null; // 2D rendering context for the canvas
  paddleX: number = 0; // X-coordinate of the paddle
  ballX: number = 0; // X-coordinate of the ball
  ballY: number = 0; // Y-coordinate of the ball
  ballDX: number = 2; // X-axis speed of the ball
  ballDY: number = -2; // Y-axis speed of the ball
  paddleWidth: number = 100; // Width of the paddle
  paddleHeight: number = 10; // Height of the paddle
  ballSize: number = 10; // Size of the ball
  private destroy$ = new Subject<void>(); // Subject for managing component destruction
  isVibrating: boolean = false; // Flag indicating whether the container is vibrating

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.initializeGame(); // Initialize the game when the component is initialized

    // Subscribe to the restartGame$ observable from GameService
    this.gameService.restartGame$
      .pipe(takeUntil(this.destroy$))
      .subscribe((restart) => {
        if (restart) {
          this.restartGame(); // Restart the game when notified by the service
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeGame() {
    // Initialize the game properties and start the game loop
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext('2d');
    this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
    this.ballX = this.canvas.width / 2;
    this.ballY = 30;
    this.ballDX = 2;
    this.ballDY = 2;
    this.gameLoop();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Handle keyboard input for moving the paddle
    if (event.key === 'ArrowLeft' && this.paddleX > 0) {
      this.paddleX -= 20;
    } else if (event.key === 'ArrowRight' && this.paddleX < this.canvas!.width - this.paddleWidth) {
      this.paddleX += 20;
    }
  }

  gameLoop() {
    // The main game loop - update and draw the game continuously
    this.updateGame();
    this.drawGame();
    requestAnimationFrame(() => this.gameLoop());
  }

  updateGame() {
    // Update the game state (e.g., ball position, collisions)
    this.ballX += this.ballDX;
    this.ballY += this.ballDY;

    this.checkWallCollision();
    this.checkPaddleCollision();
  }

  checkWallCollision() {
    // Check for collisions with walls and handle accordingly
    if (this.ballX + this.ballDX > this.canvas!.width - this.ballSize || this.ballX + this.ballDX < 0) {
      this.ballDX = -this.ballDX;
      this.playBounceSound();
    }

    if (this.ballY + this.ballDY < 0) {
      this.ballDY = -this.ballDY;
      this.playBounceSound();
      this.vibrateContainer();
    }

    if (this.ballY + this.ballDY > this.canvas!.height - this.ballSize) {
      this.gameService.restartGame();
    }
  }

  vibrateContainer() {
    // Add vibration effect to the game container
    const container = document.getElementById('gameContainer');

    if (container) {
      container.classList.add('vibrating');

      // After a short time, remove the vibration class
      setTimeout(() => {
        container.classList.remove('vibrating');
      }, 100);
    }
  }

  playBounceSound() {
    // Play a sound effect when the ball bounces
    const audio = new Audio('./../../assets/audios/ball-sound.mp3');
    audio.play();
  }

  checkPaddleCollision() {
    // Check for collisions with the paddle and handle accordingly
    if (
      this.ballY + this.ballDY > this.canvas!.height - this.paddleHeight - this.ballSize &&
      this.ballX > this.paddleX &&
      this.ballX < this.paddleX + this.paddleWidth
    ) {
      this.ballDY = -this.ballDY;
      this.playBounceSound();

      // Increase the speed by 5
      if (this.ballDY > 0) {
        this.ballDY += 1;
      } else {
        this.ballDY -= 1;
      }
    }
  }

  drawGame() {
    // Draw the game elements on the canvas
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    // Draw the outer rectangle
    this.drawOuterRectangle();

    // Draw the trail of points for the ball (streak)
    for (let i = 0; i < 5; i++) {
      const alpha = 1 - (i + 1) / 5;
      const offsetX = this.ballDX * i * 5;
      const offsetY = this.ballDY * i * 5;
      this.drawBall(this.ballX - offsetX, this.ballY - offsetY, this.ballSize - i * 2, alpha);
    }

    // Draw the paddle
    this.ctx.beginPath();
    this.ctx.rect(
      this.paddleX,
      this.canvas!.height - this.paddleHeight,
      this.paddleWidth,
      this.paddleHeight
    );
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fill();
    this.ctx.closePath();

    // Draw the ball
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballSize, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fill();
    this.ctx.closePath();

    this.drawBall(this.ballX, this.ballY, this.ballSize);
  }

  drawBall(x: number, y: number, size: number, alpha: number = 1) {
    // Draw an individual ball with specified properties
    this.ctx!.beginPath();
    this.ctx!.arc(x, y, size, 0, Math.PI * 2);
    this.ctx!.fillStyle = `rgba(0, 149, 221, ${alpha})`;
    this.ctx!.fill();
    this.ctx!.closePath();
  }

  drawOuterRectangle() {
    // Draw the outer rectangle on the canvas
    this.ctx!.beginPath();
    const cornerRadius = 5;
    const borderWidth = 5;
    this.ctx!.moveTo(cornerRadius, 0);
    this.ctx!.arcTo(this.canvas!.width, 0, this.canvas!.width, this.canvas!.height, cornerRadius);
    this.ctx!.arcTo(this.canvas!.width, this.canvas!.height, 0, this.canvas!.height, cornerRadius);
    this.ctx!.arcTo(0, this.canvas!.height, 0, 0, cornerRadius);
    this.ctx!.arcTo(0, 0, this.canvas!.width, 0, cornerRadius);
    this.ctx!.lineWidth = borderWidth;
    this.ctx!.strokeStyle = 'white';
    this.ctx!.stroke();
    this.ctx!.closePath();
  }

  drawInnerRectangle() {
    // Draw the inner rectangle on the canvas
    const innerMargin = 10;

    this.ctx!.beginPath();
    this.ctx!.rect(
      innerMargin,
      innerMargin,
      this.canvas!.width - innerMargin * 2,
      this.canvas!.height - innerMargin * 2
    );
    this.ctx!.lineWidth = 2;
    this.ctx!.strokeStyle = 'red';
    this.ctx!.stroke();
    this.ctx!.closePath();
  }

  restartGame() {
    // Restart the game by resetting positions and speeds
    this.ballX = this.canvas!.width / 2;
    this.ballY = this.canvas!.height - 30;
    this.ballDX = 2;
    this.ballDY = -2;
    this.vibrateContainer();
  }
}
