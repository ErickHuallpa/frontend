import { Component, inject, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';
export enum StatusMessage{
  Success,
  Error,
  Warning,
  Info,
  None
}

@Component({
  selector: 'app-notificar',
  standalone:true,
  imports: [
    MatIcon,
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction
  ],
  templateUrl: './notificar.component.html',
  styleUrl: './notificar.component.css'
})
export class NotificarComponent {
  StatusMessage = StatusMessage;
  /*estado = input <StatusMessage>(StatusMessage.None);
  msg = input<string>('');*/
  @Input() estado:StatusMessage=StatusMessage.None;
  @Input() msg:string = '';
  snackBarRef = inject(MatSnackBarRef);
}
