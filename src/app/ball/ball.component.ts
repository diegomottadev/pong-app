import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ball',
  standalone: true,
  imports: [],
  template: '<div class="ball" [style.top]="top + \'px\'" [style.left]="left + \'px\'"></div>',
  styleUrl: './ball.component.css'
  
})
export class BallComponent {
  @Input() top: number = 0;
  @Input() left: number = 0;

  private _y: number = 0;

  get y(): number {
    return this._y;
  }

  setY(y: number): void {
    this._y = y;
  }

}
