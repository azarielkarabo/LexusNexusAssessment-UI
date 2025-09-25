import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import {
  LoadPagedProductsAction,
  LoadPagedProductsFailAction,
  LoadPagedProductsSuccessAction,
  LoadProductByIdAction,
  LoadProductByIdFailAction,
  LoadProductByIdSuccessAction,
  CreateProductAction,
  CreateProductFailAction,
  CreateProductSuccessAction,
  UpdateProductAction,
  UpdateProductFailAction,
  UpdateProductSuccessAction,
  DeleteProductAction,
  DeleteProductFailAction,
  DeleteProductSuccessAction
} from "./product.actions";
import { catchError, tap } from "rxjs";
import {
  ProductDto,
  ProductSearchResultDto
} from "src/models/product-models";
import { ProductsApiService } from "src/serivces/product.service";

export class ProductStateModel {
  public isLoading: boolean | null | undefined;
  public products: ProductDto[] | null | undefined;
  public pagedProducts: ProductSearchResultDto | null | undefined;
  public selectedProduct: ProductDto | null | undefined;
}

@State<ProductStateModel>({
  name: "products",
  defaults: {
    isLoading: false,
    products: [],
    pagedProducts: undefined,
    selectedProduct: undefined
  }
})
@Injectable()
export class ProductState {
  constructor(private productsService: ProductsApiService) { }

  // 📌 Selectors
  @Selector()
  static getProducts(state: ProductStateModel) {
    return state.products;
  }

  @Selector()
  static getPagedProducts(state: ProductStateModel) {
    return state.pagedProducts;
  }

  @Selector()
  static getSelectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static getIsLoading(state: ProductStateModel) {
    return state.isLoading;
  }

  // 📌 Actions

  @Action(LoadPagedProductsAction)
  loadPagedProducts(ctx: StateContext<ProductStateModel>, action: LoadPagedProductsAction) {
    ctx.patchState({ isLoading: true });

    return this.productsService
      .getProducts(action.payload)
      .pipe(
        tap((response: ProductSearchResultDto) =>
          ctx.dispatch(new LoadPagedProductsSuccessAction({ response }))
        ),
        catchError(() => ctx.dispatch(new LoadPagedProductsFailAction()))
      );
  }

  @Action(LoadPagedProductsSuccessAction)
  loadPagedProductsSuccess(ctx: StateContext<ProductStateModel>, action: LoadPagedProductsSuccessAction) {
    ctx.patchState({
      isLoading: false,
      pagedProducts: action.payload.response,
      products: action.payload.response.products
    });
  }

  @Action(LoadPagedProductsFailAction)
  loadPagedProductsFail(ctx: StateContext<ProductStateModel>) {
    ctx.patchState({ isLoading: false, pagedProducts: null, products: [] });
  }

  @Action(LoadProductByIdAction)
  loadProductById(ctx: StateContext<ProductStateModel>, action: LoadProductByIdAction) {
    ctx.patchState({ isLoading: true });

    return this.productsService
      .getProductById(action.payload.id)
      .pipe(
        tap((response: ProductDto) =>
          ctx.dispatch(new LoadProductByIdSuccessAction({ response }))
        ),
        catchError(() => ctx.dispatch(new LoadProductByIdFailAction()))
      );
  }

  @Action(LoadProductByIdSuccessAction)
  loadProductByIdSuccess(ctx: StateContext<ProductStateModel>, action: LoadProductByIdSuccessAction) {
    ctx.patchState({ isLoading: false, selectedProduct: action.payload.response });
  }

  @Action(LoadProductByIdFailAction)
  loadProductByIdFail(ctx: StateContext<ProductStateModel>) {
    ctx.patchState({ isLoading: false, selectedProduct: null });
  }

  @Action(CreateProductAction)
  createProduct(ctx: StateContext<ProductStateModel>, action: CreateProductAction) {
    ctx.patchState({ isLoading: true });

    return this.productsService
      .createProduct(action.payload.dto)
      .pipe(
        tap((response: ProductDto) =>
          ctx.dispatch(new CreateProductSuccessAction({ response }))
        ),
        catchError(() => ctx.dispatch(new CreateProductFailAction()))
      );
  }

  @Action(CreateProductSuccessAction)
  createProductSuccess(ctx: StateContext<ProductStateModel>, action: CreateProductSuccessAction) {
    const state = ctx.getState();
    ctx.patchState({
      isLoading: false,
      products: [...(state.products ?? []), action.payload.response]
    });
  }

  @Action(CreateProductFailAction)
  createProductFail(ctx: StateContext<ProductStateModel>) {
    ctx.patchState({ isLoading: false });
  }

  @Action(UpdateProductAction)
  updateProduct(ctx: StateContext<ProductStateModel>, action: UpdateProductAction) {
    ctx.patchState({ isLoading: true });

    return this.productsService
      .updateProduct(action.payload.id, action.payload.dto)
      .pipe(
        tap((response: ProductDto) =>
          ctx.dispatch(new UpdateProductSuccessAction({ response }))
        ),
        catchError(() => ctx.dispatch(new UpdateProductFailAction()))
      );
  }

  @Action(UpdateProductSuccessAction)
  updateProductSuccess(ctx: StateContext<ProductStateModel>, action: UpdateProductSuccessAction) {
    const state = ctx.getState();
    ctx.patchState({
      isLoading: false,
      products: state.products?.map(p =>
        p.id === action.payload.response.id ? action.payload.response : p
      )
    });
  }

  @Action(UpdateProductFailAction)
  updateProductFail(ctx: StateContext<ProductStateModel>) {
    ctx.patchState({ isLoading: false });
  }

  @Action(DeleteProductAction)
  deleteProduct(ctx: StateContext<ProductStateModel>, action: DeleteProductAction) {
    ctx.patchState({ isLoading: true });

    return this.productsService
      .deleteProduct(action.payload.id)
      .pipe(
        tap(() => ctx.dispatch(new DeleteProductSuccessAction({ id: action.payload.id }))),
        catchError(() => ctx.dispatch(new DeleteProductFailAction()))
      );
  }

  @Action(DeleteProductSuccessAction)
  deleteProductSuccess(ctx: StateContext<ProductStateModel>, action: DeleteProductSuccessAction) {
    const state = ctx.getState();
    ctx.patchState({
      isLoading: false,
      products: state.products?.filter(p => p.id !== action.payload.id)
    });
  }

  @Action(DeleteProductFailAction)
  deleteProductFail(ctx: StateContext<ProductStateModel>) {
    ctx.patchState({ isLoading: false });
  }
}
