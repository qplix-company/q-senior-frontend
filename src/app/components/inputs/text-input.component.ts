import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'text-input',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <mat-form-field [ngClass]="className" appearance="fill">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [formControl]="control"
        [disabled]="disabled"
        [placeholder]="placeholder"
      />
    </mat-form-field>
  `,
})
export class TextInputComponent {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() className?: string;
}
