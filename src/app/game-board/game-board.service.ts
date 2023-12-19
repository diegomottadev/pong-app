// Import necessary modules from Angular and RxJS
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Decorator indicating that this class is an injectable service
@Injectable({
  providedIn: 'root',
})
export class GameService {
  // BehaviorSubject to track the state of whether the game should restart or not
  restartGame$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // Method to trigger a game restart
  restartGame() {
    // Set the value of restartGame$ to true, notifying all subscribers
    this.restartGame$.next(true);
  }
}
