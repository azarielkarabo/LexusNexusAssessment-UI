import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/models/category-models';
import {
  CreateCategorySuccessAction
} from 'src/ngxs-store/category-store/category.actions';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';

@Component({
  selector: 'app-category-tree',
  template: `
    <div class="category-tree-container">
      <!-- Header with actions -->
      <div class="tree-header">
        <h3 class="tree-title">
          <mat-icon>category</mat-icon>
          Product Categories
        </h3>
        <div class="tree-actions">
          <button mat-stroked-button (click)="expandAll()" class="action-btn">
            <mat-icon>unfold_more</mat-icon>
            Expand All
          </button>
          <button mat-stroked-button (click)="collapseAll()" class="action-btn">
            <mat-icon>unfold_less</mat-icon>
            Collapse All
          </button>
          <button mat-raised-button color="primary" (click)="openAddDialog()" class="primary-action-btn">
            <mat-icon>add</mat-icon>
            Add Category
          </button>
        </div>
      </div>

      <!-- Loading spinner -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading categories...</p>
      </div>

      <!-- Empty state -->
      <div *ngIf="!isLoading && (!categories || categories.length === 0)" class="empty-state">
        <mat-icon class="empty-icon">category</mat-icon>
        <h4>No categories yet</h4>
        <p>Create your first category to get started</p>
        <button mat-raised-button color="primary" (click)="openAddDialog()">
          <mat-icon>add</mat-icon>
          Create First Category
        </button>
      </div>

      <!-- Category tree using separate node components -->
      <div *ngIf="!isLoading && categories && categories.length > 0" class="tree-container">
        <div class="category-tree">
          <app-category-tree-node 
            *ngFor="let category of categories"
            [category]="category"
            [level]="0"
            [expandedCategories]="expandedCategories"
            (toggleExpandedChange)="toggleExpanded($event)"
            (addCategoryClick)="onAddCategoryClick($event)"
            (editCategoryClick)="onEditCategoryClick($event)"
            (deleteCategoryClick)="onDeleteCategoryClick($event)">
          </app-category-tree-node>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./category-tree.component.css']
})
export class CategoryTreeComponent {
  @Input() categories: CategoryDto[] | null = [];
  @Input() isLoading: boolean | null = false;
  @Output() createCategoryClick = new EventEmitter<CreateCategoryDto>();
  @Output() editCategoryClick = new EventEmitter<{ dto: UpdateCategoryDto, id: number }>();
  @Output() deleteCategoryClick = new EventEmitter<number>();

  expandedCategories = new Set<number>();

  constructor(public dialog: MatDialog, private actions$: Actions) {}

  expandAll(): void {
    if (this.categories) {
      this.addAllToExpanded(this.categories);
    }
  }

  collapseAll(): void {
    this.expandedCategories.clear();
  }

  private addAllToExpanded(categories: CategoryDto[]): void {
    categories.forEach(category => {
      const children = category.childCategories || category.childCategories || [];
      if (children.length > 0) {
        this.expandedCategories.add(category.id);
        this.addAllToExpanded(children);
      }
    });
  }

  toggleExpanded(categoryId: number): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  openAddDialog(parentCategory: CategoryDto | null = null): void {
    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '600px',
      data: { parentCategory }
    });

    dialogRef.componentInstance.createCategoryClick.subscribe((dto: CreateCategoryDto) => {
      this.createCategoryClick.emit(dto);
      this.actions$
        .pipe(ofActionSuccessful(CreateCategorySuccessAction))
        .subscribe(() => dialogRef.close());
    });
  }

  onAddCategoryClick(dto: CreateCategoryDto): void {
    this.createCategoryClick.emit(dto);
  }

  onEditCategoryClick(event: { dto: UpdateCategoryDto, id: number }): void {
    this.editCategoryClick.emit(event);
  }

  onDeleteCategoryClick(categoryId: number): void {
    this.deleteCategoryClick.emit(categoryId);
  }
}