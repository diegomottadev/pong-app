// game.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  restartGame$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  restartGame() {
    this.restartGame$.next(true);
  }
}
