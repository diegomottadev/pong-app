// Import necessary modules and components from Angular
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameBoardComponent } from './game-board/game-board.component'; // Import the GameBoardComponent
import { GameService } from './game-board/game-board.service';

// Define the main application component
@Component({
  selector: 'app-root', // Selector for the component
  standalone: true, // Indicates that this component is standalone
  imports: [CommonModule, RouterOutlet, GameBoardComponent], // Import necessary modules
  templateUrl: './app.component.html', // Template for the component
  styleUrl: './app.component.css', // Styles for the component
})
export class AppComponent implements OnInit {
  // ViewChild is used to access the game container in the HTML
  @ViewChild('gameContainer', { read: ElementRef }) gameContainer!: ElementRef; // Reference to the game container in the HTML

  constructor(
    private gameService: GameService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Lifecycle hook called after Angular initializes the component
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startGame();
    }
  }
  // Method to start the game
  startGame() {
    // Create a new canvas element
    if (isPlatformBrowser(this.platformId)) {
      const canvas = document.createElement('canvas');
      canvas.id = 'gameCanvas'; // Set the ID for the canvas
      canvas.width = 200; // Set the width of the canvas
      canvas.height = 400; // Set the height of the canvas
      document.body.appendChild(canvas); // Append the canvas to the body of the HTML document

      // Get the 2D rendering context for the canvas
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // If the context is available, create an instance of the GameBoardComponent
        const gameBoardComponent = new GameBoardComponent(this.gameService);

        // Assign the canvas and context to the GameBoardComponent
        gameBoardComponent.canvas = canvas;
        gameBoardComponent.ctx = ctx;

        // Append the canvas to the game container in the HTML
        this.gameContainer.nativeElement.appendChild(canvas);

        // Initialize the game using the GameBoardComponent
        gameBoardComponent.initializeGame();
      } else {
        // If the context is not available, log an error message
        console.error('Context is not available');
      }
    }
  }
}
