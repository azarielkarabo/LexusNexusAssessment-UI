import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import {
  LoadAllCategoriesAction,
  LoadAllCategoriesSuccessAction,
  LoadAllCategoriesFailAction,
  LoadCategoriesTreeAction,
  LoadCategoriesTreeSuccessAction,
  LoadCategoriesTreeFailAction,
  CreateCategoryAction,
  CreateCategorySuccessAction,
  CreateCategoryFailAction
} from "./category.actions";
import { catchError, tap } from "rxjs";
import { CategoryDto, CreateCategoryDto } from "src/models/category-models";
import { CategoriesApiService } from "src/serivces/category.service";

export class CategoryStateModel {
  public isLoading: boolean | null | undefined;
  public categories: CategoryDto[] | null | undefined;
  public categoryTree: CategoryDto[] | null | undefined;
  public selectedCategory: CategoryDto | null | undefined;
}

@State<CategoryStateModel>({
  name: "categories",
  defaults: {
    isLoading: false,
    categories: [],
    categoryTree: undefined,
    selectedCategory: undefined
  }
})
@Injectable()
export class CategoryState {
  constructor(private categoriesService: CategoriesApiService) {}

  // 📌 Selectors
  @Selector()
  static getCategories(state: CategoryStateModel) {
    return state.categories;
  }

  @Selector()
  static getCategoryTree(state: CategoryStateModel) {
    return state.categoryTree;
  }

  @Selector()
  static getSelectedCategory(state: CategoryStateModel) {
    return state.selectedCategory;
  }

  @Selector()
  static getIsLoading(state: CategoryStateModel) {
    return state.isLoading;
  }

  // 📌 Actions

  @Action(LoadAllCategoriesAction)
  loadAllCategories(ctx: StateContext<CategoryStateModel>) {
    ctx.patchState({ isLoading: true });

    return this.categoriesService.getAllCategories().pipe(
      tap((response: CategoryDto[]) =>
        ctx.dispatch(new LoadAllCategoriesSuccessAction({ response }))
      ),
      catchError(() => ctx.dispatch(new LoadAllCategoriesFailAction()))
    );
  }

  @Action(LoadAllCategoriesSuccessAction)
  loadAllCategoriesSuccess(
    ctx: StateContext<CategoryStateModel>,
    action: LoadAllCategoriesSuccessAction
  ) {
    ctx.patchState({
      isLoading: false,
      categories: action.payload.response
    });
  }

  @Action(LoadAllCategoriesFailAction)
  loadAllCategoriesFail(ctx: StateContext<CategoryStateModel>) {
    ctx.patchState({ isLoading: false, categories: [] });
  }

  @Action(LoadCategoriesTreeAction)
  loadCategoriesTree(ctx: StateContext<CategoryStateModel>) {
    ctx.patchState({ isLoading: true });

    return this.categoriesService.getCategoryTree().pipe(
      tap((response: CategoryDto[]) =>
        ctx.dispatch(new LoadCategoriesTreeSuccessAction({ response }))
      ),
      catchError(() => ctx.dispatch(new LoadCategoriesTreeFailAction()))
    );
  }

  @Action(LoadCategoriesTreeSuccessAction)
  loadCategoriesTreeSuccess(
    ctx: StateContext<CategoryStateModel>,
    action: LoadCategoriesTreeSuccessAction
  ) {
    ctx.patchState({
      isLoading: false,
      categoryTree: action.payload.response
    });
  }

  @Action(LoadCategoriesTreeFailAction)
  loadCategoriesTreeFail(ctx: StateContext<CategoryStateModel>) {
    ctx.patchState({ isLoading: false, categoryTree: [] });
  }

  @Action(CreateCategoryAction)
  createCategory(ctx: StateContext<CategoryStateModel>, action: CreateCategoryAction) {
    ctx.patchState({ isLoading: true });

    return this.categoriesService.createCategory(action.payload.dto).pipe(
      tap((response: CategoryDto) =>
        ctx.dispatch(new CreateCategorySuccessAction({ response }))
      ),
      catchError(() => ctx.dispatch(new CreateCategoryFailAction()))
    );
  }

  @Action(CreateCategorySuccessAction)
  createCategorySuccess(
    ctx: StateContext<CategoryStateModel>,
    action: CreateCategorySuccessAction
  ) {
    const state = ctx.getState();
    ctx.patchState({
      isLoading: false,
      categories: [...(state.categories ?? []), action.payload.response]
    });
  }

  @Action(CreateCategoryFailAction)
  createCategoryFail(ctx: StateContext<CategoryStateModel>) {
    ctx.patchState({ isLoading: false });
  }
}
