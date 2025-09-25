import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductDto, ProductSearchResultDto, CreateProductDto, UpdateProductDto } from 'src/models/product-models';
import { CreateProductSuccessAction, UpdateProductAction, UpdateProductSuccessAction } from 'src/ngxs-store/product-store/product.actions';
import { CreateProductDialogComponent } from '../create-product-dialog/create-product-dialog.component';
import { UpdateProductDialogComponent } from '../update-product-dialog/update-product-dialog.component';
import { DeleteProductDialogComponent } from '../delete-product-dialog/delete-product-dialog.component';

interface SearchModel {
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageSize: number;
  currentPage: number;
  categoryId?: number;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnChanges, OnInit {
  @Input() products: ProductDto[] | null = [];
  @Input() pagedProducts: ProductSearchResultDto | null = null;
  @Input() isLoading: boolean | null = false;
  
  @Output() loadPagedProductsClick = new EventEmitter<SearchModel>();
  @Output() createProductClick = new EventEmitter<CreateProductDto>();
  @Output() editProductClick = new EventEmitter<{ dto: UpdateProductDto, id: number }>();
  @Output() deleteProductClick = new EventEmitter<number>();

  searchForm: FormGroup;
  showAdvancedSearch = false;
  
  displayedColumns: string[] = [
    'name', 'description', 'sku', 'price', 'quantity', 'categoryId', 'createdAt', 'actions'
  ];
  
  options: number[] = [10, 20, 30, 50, 100];
  dataSource: MatTableDataSource<ProductDto> = new MatTableDataSource();
  
  // Sort options
  sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'quantity', label: 'Quantity' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'sku', label: 'SKU' }
  ];

  // Mock categories - replace with actual categories from your service
  categories = [
    { id: 1, name: 'Test Cat 1' },
    { id: 2, name: 'Test Cat 2' },
    { id: 5, name: 'Test Cat 5' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog, 
    private store: Store, 
    private actions$: Actions,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchTerm: [''],
      categoryId: [null],
      sortBy: ['name'],
      sortDirection: ['asc'],
      minPrice: [null],
      maxPrice: [null]
    });
  }

  ngOnInit(): void {
    // Subscribe to search form changes with debounce
    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.performSearch();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products'] && changes['products'].currentValue) {
      this.dataSource.data = this.products!;
    }
  }

  performSearch(): void {
    const formValue = this.searchForm.value;
    const currentPage = this.paginator?.pageIndex + 1 || 1;
    const pageSize = this.paginator?.pageSize || 10;

    const searchModel: SearchModel = {
      searchTerm: formValue.searchTerm || undefined,
      sortBy: formValue.sortBy || 'name',
      sortDirection: formValue.sortDirection || 'asc',
      pageSize: pageSize,
      currentPage: currentPage,
      categoryId: formValue.categoryId || undefined
    };

    this.loadPagedProductsClick.emit(searchModel);
  }

  onPageChange(event: PageEvent): void {
    const formValue = this.searchForm.value;
    
    const searchModel: SearchModel = {
      searchTerm: formValue.searchTerm || undefined,
      sortBy: formValue.sortBy || 'name',
      sortDirection: formValue.sortDirection || 'asc',
      pageSize: event.pageSize,
      currentPage: event.pageIndex + 1,
      categoryId: formValue.categoryId || undefined
    };

    this.loadPagedProductsClick.emit(searchModel);
  }

  clearSearch(): void {
    this.searchForm.reset({
      searchTerm: '',
      categoryId: null,
      sortBy: 'name',
      sortDirection: 'asc',
      minPrice: null,
      maxPrice: null
    });
  }

  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
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

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
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