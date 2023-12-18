import { Component, OnInit, HostListener, ViewContainerRef, ComponentFactoryResolver, Injector, EmbeddedViewRef, ApplicationRef, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import { GameService } from './game-board.service';
import { Subject, takeUntil } from 'rxjs';
import { ElementRef, Renderer2 } from '@angular/core';

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
  isVibrating: boolean = false;


  constructor(private gameService: GameService) {

  }

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
      this.ballY = 30;
      this.ballDX = 2; // Adjust as needed
      this.ballDY = 2; // Set a positive value for downward movement
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
      this.playBounceSound();
    }
  
    if (this.ballY + this.ballDY < 0) {
      this.ballDY = -this.ballDY;
      this.playBounceSound();
    }
  
    if (this.ballY + this.ballDY > this.canvas!.height - this.ballSize) {
      this.gameService.restartGame();
    }
  }
  
  playBounceSound() {
    const audio = new Audio('./../../assets/audios/ball-sound.mp3'); // Adjust the path based on your project structure
    audio.play();
  }
  
  checkPaddleCollision() {
    if (
      this.ballY + this.ballDY > this.canvas!.height - this.paddleHeight - this.ballSize &&
      this.ballX > this.paddleX &&
      this.ballX < this.paddleX + this.paddleWidth
    ) {
      this.ballDY = -this.ballDY; // Invierte la dirección vertical
      this.playBounceSound();
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
  
    // Dibujar el recuadro adicional
    this.drawOuterRectangle();
  

    // Dibujar el rastro de puntos de la pelota (estela)
    for (let i = 0; i < 5; i++) {
      const alpha = 1 - (i + 1) / 5; // Ajusta la opacidad de los puntos
      const offsetX = this.ballDX * i * 5; // Calcula el desplazamiento en X en función de la dirección y velocidad de la pelota
      const offsetY = this.ballDY * i * 5; // Calcula el desplazamiento en Y en función de la dirección y velocidad de la pelota
      this.drawBall(this.ballX - offsetX, this.ballY - offsetY, this.ballSize - i * 2, alpha);
    }
    
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
    this.drawBall(this.ballX, this.ballY, this.ballSize);

  }

  drawBall(x: number, y: number, size: number, alpha: number = 1) {
    this.ctx!.beginPath();
    this.ctx!.arc(x, y, size, 0, Math.PI * 2);
    this.ctx!.fillStyle = `rgba(0, 149, 221, ${alpha})`; // Ajusta el color según tus preferencias
    this.ctx!.fill();
    this.ctx!.closePath();
  }

  drawOuterRectangle() {
    // Configurar el estilo del recuadro adicional externo
    this.ctx!.beginPath();
    const cornerRadius = 20; // Ajusta según tus preferencias
    const borderWidth = 15; // Ajusta según tus preferencias
    this.ctx!.moveTo(cornerRadius, 0);
    this.ctx!.arcTo(this.canvas!.width, 0, this.canvas!.width, this.canvas!.height, cornerRadius);
    this.ctx!.arcTo(this.canvas!.width, this.canvas!.height, 0, this.canvas!.height, cornerRadius);
    this.ctx!.arcTo(0, this.canvas!.height, 0, 0, cornerRadius);
    this.ctx!.arcTo(0, 0, this.canvas!.width, 0, cornerRadius);
    this.ctx!.lineWidth = borderWidth;
    this.ctx!.strokeStyle = 'white';
    this.ctx!.stroke(); // Dibujar el contorno del recuadro
    this.ctx!.closePath();
  }
  
  drawInnerRectangle() {
    const innerMargin = 10;
  
    // Configurar el estilo del recuadro adicional interno
    this.ctx!.beginPath();
    this.ctx!.rect(
      innerMargin,
      innerMargin,
      this.canvas!.width - innerMargin * 2,
      this.canvas!.height - innerMargin * 2
    );
    this.ctx!.lineWidth = 2;
    this.ctx!.strokeStyle = 'red';
    this.ctx!.stroke(); // Dibujar el contorno del recuadro
    this.ctx!.closePath();
  }
  


  restartGame() {
    // Lógica para reiniciar el juego, por ejemplo, resetear posiciones y velocidades
    this.ballX = this.canvas!.width / 2;
    this.ballY = this.canvas!.height - 30;
    this.ballDX = 2;
    this.ballDY = -2;
  }
}