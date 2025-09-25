import { ChangeDetectionStrategy, Component } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from "src/models/category-models";
import { 
    CreateCategoryAction, 
    LoadCategoriesTreeAction
} from "src/ngxs-store/category-store/category.actions";
import { CategoryState } from "src/ngxs-store/category-store/category.state";
import { TableService } from "src/serivces/table.services";

@Component({
  selector: 'app-category-tree-page',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-category-tree
      [categories]="categories$ | async"
      [isLoading]="isLoading$ | async"
      (createCategoryClick)="createCategory($event)">
    </app-category-tree>
  `
})
export class CategoryTreePageComponent {
  @Select(CategoryState.getIsLoading) isLoading$: Observable<boolean> | undefined | null;
  @Select(CategoryState.getCategoryTree) categories$: Observable<CategoryDto[]> | undefined | null;

  constructor(private store: Store) {
    // Initial load with default paging
    this.store.dispatch(new LoadCategoriesTreeAction());
  }

  createCategory(dto: CreateCategoryDto) {
    this.store.dispatch(new CreateCategoryAction({ dto }));
  }
}
