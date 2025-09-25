import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { ProductDto, ProductSearchResultDto, CreateProductDto, UpdateProductDto } from 'src/models/product-models';
import { CreateProductSuccessAction, UpdateProductAction, UpdateProductSuccessAction } from 'src/ngxs-store/product-store/product.actions';
import { CreateProductDialogComponent } from '../create-product-dialog/create-product-dialog.component';
import { UpdateProductDialogComponent } from '../update-product-dialog/update-product-dialog.component';
import { DeleteProductDialogComponent } from '../delete-product-dialog/delete-product-dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnChanges {
  @Input() products: ProductDto[] | null = [];
  @Input() pagedProducts: ProductSearchResultDto | null = null;
  @Input() isLoading: boolean | null = false;

  @Output() loadPagedProductsClick = new EventEmitter<{ pageSize: number; currentPage: number }>();
  @Output() createProductClick = new EventEmitter<CreateProductDto>();
  @Output() editProductClick = new EventEmitter<{ dto: UpdateProductDto, id: number }>();
  @Output() deleteProductClick = new EventEmitter<number>();

  displayedColumns: string[] = [
    'name', 'description', 'sku', 'price', 'quantity', 'categoryId', 'createdAt', 'actions'
  ];

  options: number[] = [10, 20, 30, 50, 100];

  dataSource: MatTableDataSource<ProductDto> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private store: Store, private actions$: Actions) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && changes['products'].currentValue) {
      this.dataSource.data = this.products!;
    }
  }

  onPageChange(event: PageEvent) {
    this.loadPagedProductsClick.emit({
      pageSize: event.pageSize,
      currentPage: event.pageIndex + 1
    });
  }

  openAddDialog(): void {
    
    const dialogRef = this.dialog.open(CreateProductDialogComponent, { width: '900px' });

    dialogRef.componentInstance.createProductClick.subscribe((dto: CreateProductDto) => {
      this.createProductClick.emit(dto);
      this.actions$
        .pipe(ofActionSuccessful(CreateProductSuccessAction))
        .subscribe(() => dialogRef.close());
    });
  }

  openEditDialog(product: ProductDto): void {
    
    const dialogRef = this.dialog.open(UpdateProductDialogComponent, {
      width: '900px',
      data: { product }
    });

    dialogRef.componentInstance.updateProductClick.subscribe((dto: UpdateProductDto & { id: number }) => {
      
      this.store.dispatch(new UpdateProductAction({ dto, id: dto.id }));
      this.editProductClick.emit({ dto, id: dto.id });
      this.actions$
        .pipe(ofActionSuccessful(UpdateProductSuccessAction))
        .subscribe(() => dialogRef.close());
    });
  }

  delete(product: ProductDto): void {
    const dialogRef = this.dialog.open(DeleteProductDialogComponent, {
      width: '900px'
    });

    dialogRef.componentInstance.confirmClick.subscribe(() => {
      this.deleteProductClick.emit(product.id);
    });
  }
}
