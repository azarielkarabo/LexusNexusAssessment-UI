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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const product = data.product as ProductDto;
    this.form = this.fb.group({
      name: [product.name, Validators.required],
      description: [product.description],
      sku: [product.sku, Validators.required],
      price: [product.price, Validators.required],
      quantity: [product.quantity, Validators.required],
      categoryId: [product.categoryId, Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      
      const model = (this.form.value as UpdateProductDto);
      this.updateProductClick.emit({ id: this.data.product.id, ...model });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
