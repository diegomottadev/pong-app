import { Component, OnInit, HostListener, ViewContainerRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, ApplicationRef, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { GameService } from './game-board.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-game-board',
  standalone: true,
  imports: [],
  templateUrl: './game-board.component.html',
  styleUrl: './game-board.component.css',
})
export class GameBoardComponent implements OnInit {
  canvas: HTMLCanvasElement | null = null;
  ctx: CanvasRenderingContext2D | null = null;
  paddleX: number = 0;
  ballX: number = 0;
  ballY: number = 0;
  ballDX: number = 2;
  ballDY: number = -2;
  paddleWidth: number = 100;
  paddleHeight: number = 10;
  ballSize: number = 10;
  private destroy$ = new Subject<void>();

  constructor(

    private gameService: GameService
  ) {}

  ngOnInit() {
    this.initializeGame();

    this.gameService.restartGame$
      .pipe(takeUntil(this.destroy$))
      .subscribe((restart) => {
        if (restart) {
          this.restartGame();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  initializeGame() {

      this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
      this.ctx = this.canvas?.getContext('2d');
      this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
      this.ballX = this.canvas.width / 2;
      this.ballY = this.canvas.height - 30;

      this.gameLoop();

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.paddleX > 0) {
      this.paddleX -= 20;
    } else if (event.key === 'ArrowRight' && this.paddleX < this.canvas!.width - this.paddleWidth) {
      this.paddleX += 20;
    }
  }

  gameLoop() {
    this.updateGame();
    this.drawGame();
    requestAnimationFrame(() => this.gameLoop());
  }

  updateGame() {
    this.ballX += this.ballDX;
    this.ballY += this.ballDY;

    this.checkWallCollision();
    this.checkPaddleCollision();
  }

  checkWallCollision() {
    if (this.ballX + this.ballDX > this.canvas!.width - this.ballSize || this.ballX + this.ballDX < 0) {
      this.ballDX = -this.ballDX;
    }

    if (this.ballY + this.ballDY < 0) {
      this.ballDY = -this.ballDY;
    }

    if (this.ballY + this.ballDY > this.canvas!.height - this.ballSize) {
      this.gameService.restartGame(); // reiniciar el juego en colisión con la pared inferior
    }
  }

  checkPaddleCollision() {
    if (
      this.ballY + this.ballDY > this.canvas!.height - this.paddleHeight - this.ballSize &&
      this.ballX > this.paddleX &&
      this.ballX < this.paddleX + this.paddleWidth
    ) {
      this.ballDY = -this.ballDY; // Invierte la dirección vertical
  
      // Aumenta la velocidad en 5
      if (this.ballDY > 0) {
        this.ballDY += 1;
      } else {
        this.ballDY -= 1;
      }
    }
  }
  

  drawGame() {
    if (!this.ctx) {
      return; // Salir si el contexto no está definido
    }

    this.ctx.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

    // Dibujar la paleta
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

    // Dibujar la pelota
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballSize, 0, Math.PI * 2);
    this.ctx.fillStyle = '#0095DD';
    this.ctx.fill();
    this.ctx.closePath();
  }

  restartGame() {
    // Lógica para reiniciar el juego, por ejemplo, resetear posiciones y velocidades
    this.ballX = this.canvas!.width / 2;
    this.ballY = this.canvas!.height - 30;
    this.ballDX = 2;
    this.ballDY = -2;
  }
}