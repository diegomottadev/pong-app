import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameService } from './game-board/game-board.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, GameBoardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild('gameContainer', { read: ElementRef }) gameContainer!: ElementRef;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = 400;
    canvas.height = 600;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gameBoardComponent = new GameBoardComponent(this.gameService);
      gameBoardComponent.canvas = canvas;
      gameBoardComponent.ctx = ctx;

      this.gameContainer.nativeElement.appendChild(canvas);

      gameBoardComponent.initializeGame();
    } else {
      console.error('Context is not available');
    }
  }
}