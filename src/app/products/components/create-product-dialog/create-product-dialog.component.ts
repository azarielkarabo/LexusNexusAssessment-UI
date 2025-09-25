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
      name: ['', Validators.required],
      description: [''],
      sku: ['', Validators.required],
      price: [0, Validators.required],
      quantity: [0, Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      const model = (this.form.value as CreateProductDto);
      this.createProductClick.emit(model);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
