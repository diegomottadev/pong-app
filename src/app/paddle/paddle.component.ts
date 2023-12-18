import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-paddle',
  standalone: true,
  template: '<div class="paddle" [style.top]="top + \'px\'" [style.left]="left + \'px\'"></div>',
  styleUrls: ['./paddle.component.scss']
})
export class PaddleComponent {
  @Input() top: number = 0;
  @Input() left: number = 0;
  @Input() paddleSpeed: number = 10;
  @Input() paddleWidth: number = 100;
  @Input() paddleRightLimit: number = 0;

  @Output() move = new EventEmitter<number>();

  // Método para mover la paleta
  movePaddle(dx: number): void {
    this.left += dx;

    // Limita el movimiento dentro de los límites de la paleta
    if (this.left < 0) {
      this.left = 0;
    } else if (this.left > this.paddleRightLimit - this.paddleWidth) {
      this.left = this.paddleRightLimit - this.paddleWidth;
    }

    this.move.emit(this.left);
  }
}