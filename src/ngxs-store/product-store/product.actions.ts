
//
// GET /api/products

import { CreateProductDto, ProductDto, ProductSearchResultDto, UpdateProductDto } from "src/models/product-models";

//
export class LoadPagedProductsAction {
  static readonly type = "[Products] Load Paged";
  constructor(
    public payload: {
      searchTerm?: string;
      categoryId?: number;
      page?: number;
      pageSize?: number;
      sortBy?: string;
      sortDirection?: string;
    }
  ) {}
}

export class LoadPagedProductsSuccessAction {
  static readonly type = "[Products] Load Paged Success";
  constructor(public payload: { response: ProductSearchResultDto }) {}
}

export class LoadPagedProductsFailAction {
  static readonly type = "[Products] Load Paged Fail";
}

//
// GET /api/products/{id}
//
export class LoadProductByIdAction {
  static readonly type = "[Products] Load By Id";
  constructor(public payload: { id: number }) {}
}

export class LoadProductByIdSuccessAction {
  static readonly type = "[Products] Load By Id Success";
  constructor(public payload: { response: ProductDto }) {}
}

export class LoadProductByIdFailAction {
  static readonly type = "[Products] Load By Id Fail";
}

//
// POST /api/products
//
export class CreateProductAction {
  static readonly type = "[Products] Create";
  constructor(public payload: { dto: CreateProductDto }) {}
}

export class CreateProductSuccessAction {
  static readonly type = "[Products] Create Success";
  constructor(public payload: { response: ProductDto }) {}
}

export class CreateProductFailAction {
  static readonly type = "[Products] Create Fail";
}

//
// PUT /api/products/{id}
//
export class UpdateProductAction {
  static readonly type = "[Products] Update";
  constructor(public payload: { id: number; dto: UpdateProductDto }) {}
}

export class UpdateProductSuccessAction {
  static readonly type = "[Products] Update Success";
  constructor(public payload: { response: ProductDto }) {}
}

export class UpdateProductFailAction {
  static readonly type = "[Products] Update Fail";
}

//
// DELETE /api/products/{id}
//
export class DeleteProductAction {
  static readonly type = "[Products] Delete";
  constructor(public payload: { id: number }) {}
}

export class DeleteProductSuccessAction {
  static readonly type = "[Products] Delete Success";
  constructor(public payload: { id: number }) {}
}

export class DeleteProductFailAction {
  static readonly type = "[Products] Delete Fail";
}
