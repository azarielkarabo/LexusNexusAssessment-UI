import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateProductDto } from 'src/models/product-models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product-dialog',
  templateUrl: './create-product-dialog.component.html',
  styleUrls: ['./create-product-dialog.component.css']
})
export class CreateProductDialogComponent {
  form: FormGroup;
  @Output() createProductClick = new EventEmitter<CreateProductDto>();

  constructor(
    public dialogRef: MatDialogRef<CreateProductDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      sku: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null]
    });
  }

  save(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const model: CreateProductDto = {
        name: formValue.name?.trim(),
        description: formValue.description?.trim() || '',
        sku: formValue.sku?.trim(),
        price: Number(formValue.price),
        quantity: Number(formValue.quantity),
        categoryId: Number(formValue.categoryId)
      };
      
      this.createProductClick.emit(model);
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
    if (field.hasError('minLength')) {
      const requiredLength = field.errors?.['minLength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must be at least ${requiredLength} characters`;
    }
    if (field.hasError('maxLength')) {
      const requiredLength = field.errors?.['maxLength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} must not exceed ${requiredLength} characters`;
    }
    if (field.hasError('min')) {
      const minValue = field.errors?.['min'].min;
      return `${this.getFieldLabel(fieldName)} must be at least ${minValue}`;
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      description: 'Description',
      sku: 'SKU',
      price: 'Price',
      quantity: 'Quantity',
      categoryId: 'Category ID'
    };
    return labels[fieldName] || fieldName;
  }
}