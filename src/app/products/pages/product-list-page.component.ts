import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { ProductDto, ProductSearchResultDto, CreateProductDto, UpdateProductDto } from "src/models/product-models";
import {
  LoadPagedProductsAction,
  CreateProductAction,
  UpdateProductAction,
  DeleteProductAction
} from "src/ngxs-store/product-store/product.actions";
import { ProductState } from "src/ngxs-store/product-store/product.state";
import { TableService } from "src/serivces/table.services";

interface SearchModel {
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: string;
  pageSize: number;
  currentPage: number;
  categoryId?: number;
}

@Component({
  selector: 'app-product-list-page',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-product-list
      [products]="products$ | async"
      [pagedProducts]="pagedProducts$ | async"
      [isLoading]="isLoading$ | async"
      (loadPagedProductsClick)="loadPagedProducts($event)"
      (createProductClick)="createProduct($event)"
      (editProductClick)="updateProduct($event)"
      (deleteProductClick)="deleteProduct($event)">
    </app-product-list>
  `
})
export class ProductListPageComponent {
  @Select(ProductState.getIsLoading) isLoading$: Observable<boolean> | undefined | null;
  @Select(ProductState.getProducts) products$: Observable<ProductDto[]> | undefined | null;
  @Select(ProductState.getPagedProducts) pagedProducts$: Observable<ProductSearchResultDto> | undefined | null;

  constructor(private store: Store, public tableService: TableService) {
    // Initial load with default paging
    const pageEvent = this.tableService.getPageEvent();
    this.store.dispatch(new LoadPagedProductsAction({
      pageSize: pageEvent.pageSize,
      page: pageEvent.pageIndex , // Convert to 1-based indexing,
      searchTerm: undefined
    }));
  }

  loadPagedProducts(model: SearchModel) {
    // Build the action payload with all search parameters
    const actionPayload: any = {
      pageSize: model.pageSize,
      page: model.currentPage
    };

    // Only add parameters if they have values
    if (model.searchTerm && model.searchTerm.trim()) {
      actionPayload.searchTerm = model.searchTerm.trim();
    }

    if (model.sortBy) {
      actionPayload.sortBy = model.sortBy;
    }

    if (model.sortDirection) {
      actionPayload.sortDirection = model.sortDirection;
    }

    if (model.categoryId) {
      actionPayload.categoryId = model.categoryId;
    }

    this.store.dispatch(new LoadPagedProductsAction(actionPayload));
  }

  createProduct(dto: CreateProductDto) {
    this.store.dispatch(new CreateProductAction({ dto }));
  }

  updateProduct(data: { dto: UpdateProductDto, id: number }) {
    this.store.dispatch(new UpdateProductAction({ id: data.id, dto: data.dto }));
  }

  deleteProduct(id: number) {
    this.store.dispatch(new DeleteProductAction({ id }));
  }
}