import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostBinding, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  animations: [
    trigger('floatIn', [
      transition(':enter', [
        style({
          transform: 'translateY(15px)',
          opacity: 0,
        }),
        animate('200ms ease-out', style({ transform: 'translateY(0px)', opacity: 1 })),
      ]),
    ]),
  ],
})
export class ConfirmDialogComponent {
  @Output() dataEmitter = new EventEmitter<boolean>();

  emitResult(result: boolean) {
    this.dataEmitter.emit(result);
  }
}
