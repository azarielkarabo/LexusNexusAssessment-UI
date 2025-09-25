import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateCategoryDto } from 'src/models/category-models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-category-dialog',
  templateUrl: './create-category-dialog.component.html',
  styleUrls: ['./create-category-dialog.component.css']
})
export class CreateCategoryDialogComponent {
  form: FormGroup;
  @Output() createCategoryClick = new EventEmitter<CreateCategoryDto>();

  constructor(
    public dialogRef: MatDialogRef<CreateCategoryDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      parentCategoryId: [data?.parentCategory?.id, [Validators.min(1)]] // optional but must be > 0 if provided
    });
  }

  save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const model: CreateCategoryDto = {
        name: formValue.name?.trim(),
        description: formValue.description?.trim() || '',
        parentCategoryId: formValue.parentCategoryId ? Number(formValue.parentCategoryId) : null
      };

      this.createCategoryClick.emit(model);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // Helper method to check if a field has a specific error
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.hasError(errorType) && (field.dirty || field.touched) : false;
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || (!field.dirty && !field.touched)) {
      return '';
    }

    if (field.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (field.hasError('minlength')) {
      const requiredLength = field.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
    }
    if (field.hasError('maxlength')) {
      const requiredLength = field.errors?.['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${requiredLength} characters`;
    }
    if (field.hasError('min')) {
      return `${this.getFieldLabel(fieldName)} must be greater than 0`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      description: 'Description',
      parentCategoryId: 'Parent Category'
    };
    return labels[fieldName] || fieldName;
  }
}
