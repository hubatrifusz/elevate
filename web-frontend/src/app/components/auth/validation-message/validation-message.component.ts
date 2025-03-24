import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation-message',
  imports: [],
  templateUrl: './validation-message.component.html',
  styleUrl: './validation-message.component.scss'
})
export class ValidationMessageComponent {
  @Input() message: string = "";
}
