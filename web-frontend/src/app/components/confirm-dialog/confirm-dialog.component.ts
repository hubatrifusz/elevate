import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
})
export class ConfirmDialogComponent {
  @Output() dataEmitter = new EventEmitter<boolean>();

  emitResult(result: boolean) {
    this.dataEmitter.emit(result);
  }
}
