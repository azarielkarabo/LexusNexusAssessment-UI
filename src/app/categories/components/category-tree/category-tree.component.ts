import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/models/category-models';
import {
  CreateCategorySuccessAction
} from 'src/ngxs-store/category-store/category.actions';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';

@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.css']
})
export class CategoryTreeComponent implements OnChanges {
  @Input() categories: CategoryDto[] | null = [];
  @Input() isLoading: boolean | null = false;

  @Output() createCategoryClick = new EventEmitter<CreateCategoryDto>();
  @Output() editCategoryClick = new EventEmitter<{ dto: UpdateCategoryDto, id: number }>();
  @Output() deleteCategoryClick = new EventEmitter<number>();

  treeControl = new NestedTreeControl<CategoryDto>(node => node.childCategories);
  dataSource = new MatTreeNestedDataSource<CategoryDto>();

  constructor(public dialog: MatDialog, private store: Store, private actions$: Actions) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && this.categories) {
      this.dataSource.data = this.buildTree(this.categories);
    }
  }

  hasChild = (_: number, node: CategoryDto) => !!node.childCategories && node.childCategories.length > 0;

  // Builds hierarchical structure from flat list
  private buildTree(categories: CategoryDto[]): CategoryDto[] {
    const map = new Map<number, CategoryDto>();
    const roots: CategoryDto[] = [];

    categories.forEach(cat => {
      map.set(cat.id, { ...cat, childCategories: [] });
    });

    map.forEach(cat => {
      if (cat.parentCategoryId) {
        const parent = map.get(cat.parentCategoryId);
        parent?.childCategories?.push(cat);
      } else {
        roots.push(cat);
      }
    });

    return roots;
  }

  openAddDialog(parentCategory: CategoryDto | null = null): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, { width: '600px', data: { parentCategory } });
    dialogRef.componentInstance.createCategoryClick.subscribe((dto: CreateCategoryDto) => {
      this.createCategoryClick.emit(dto);
      this.actions$
        .pipe(ofActionSuccessful(CreateCategorySuccessAction))
        .subscribe(() => dialogRef.close());
    });
  }
}
