// update-product-dialog.component.ts
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateProductDto, ProductDto } from 'src/models/product-models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-product-dialog',
  templateUrl: './update-product-dialog.component.html',
  styleUrls: ['./update-product-dialog.component.css']
})
export class UpdateProductDialogComponent {
  form: FormGroup;

  @Output() updateProductClick = new EventEmitter<UpdateProductDto & { id: number }>();
  constructor(
    public dialogRef: MatDialogRef<UpdateProductDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: ProductDto
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required],
      description: [data.description],
      sku: [data.sku, Validators.required],
      price: [data.price, Validators.required],
      quantity: [data.quantity, Validators.required],
      categoryId: [data.categoryId, Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      const model = (this.form.value as UpdateProductDto);
      this.updateProductClick.emit({ id: this.data.id, ...model });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
