import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from 'src/models/category-models';
import { CreateCategoryDialogComponent } from '../create-category-dialog/create-category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { CreateCategoryAction, CreateCategorySuccessAction } from 'src/ngxs-store/category-store/category.actions';

@Component({
  selector: 'app-category-tree-node',
  template: `
    <div class="tree-node" 
         [class.parent-node]="hasChildren" 
         [class.leaf-node]="!hasChildren"
         [style.padding-left.px]="level * 24 + 16">
      
      <!-- Toggle button for nodes with children -->
      <button *ngIf="hasChildren" 
              mat-icon-button 
              class="toggle-btn"
              (click)="toggleExpanded()"
              [attr.aria-label]="'Toggle ' + category.name">
        <mat-icon class="mat-icon-rtl-mirror">
          {{isExpanded ? 'expand_more' : 'chevron_right'}}
        </mat-icon>
      </button>
      
      <!-- Spacer for leaf nodes -->
      <div *ngIf="!hasChildren" class="toggle-btn-spacer"></div>
      
      <!-- Category icon -->
      <mat-icon class="category-icon">
        {{hasChildren ? 'folder' : 'label'}}
      </mat-icon>
      
      <!-- Category name -->
      <span class="node-name">{{category.name}}</span>
      
      <!-- Child count badge -->
      <span class="node-badge" *ngIf="childCount > 0">
        {{childCount}}
      </span>
      
      <!-- Action buttons -->
      <div class="node-actions">
        <button mat-icon-button 
                (click)="addSubcategory(category); $event.stopPropagation()" 
                class="action-btn"
                matTooltip="Add subcategory">
          <mat-icon>add_circle_outline</mat-icon>
        </button>
        
        <button mat-icon-button 
                (click)="editCategory(); $event.stopPropagation()" 
                class="action-btn"
                matTooltip="Edit category">
          <mat-icon>edit</mat-icon>
        </button>
        
        <button mat-icon-button 
                (click)="deleteCategory($event)" 
                class="action-btn delete-btn"
                matTooltip="Delete category">
          <mat-icon>delete_outline</mat-icon>
        </button>
      </div>
    </div>

    <!-- Child categories -->
    <ng-container *ngIf="hasChildren && isExpanded">
      <app-category-tree-node 
        *ngFor="let child of children"
        [category]="child"
        [level]="level + 1"
        [expandedCategories]="expandedCategories"
        (toggleExpandedChange)="onToggleExpandedChange($event)"
        (addCategoryClick)="onAddCategoryClick($event)"
        (editCategoryClick)="onEditCategoryClick($event)"
        (deleteCategoryClick)="onDeleteCategoryClick($event)">
      </app-category-tree-node>
    </ng-container>
  `,
  styleUrls: ['../category-tree/category-tree.component.css']
})
export class CategoryTreeNodeComponent {
  @Input() category!: CategoryDto;
  @Input() level: number = 0;
  @Input() expandedCategories!: Set<number>;

  @Output() toggleExpandedChange = new EventEmitter<number>();
  @Output() addCategoryClick = new EventEmitter<CreateCategoryDto>();
  @Output() editCategoryClick = new EventEmitter<{ dto: UpdateCategoryDto, id: number }>();
  @Output() deleteCategoryClick = new EventEmitter<number>();

  constructor(public dialog: MatDialog, private store: Store, private actions$: Actions) { }

  get hasChildren(): boolean {
    return this.children.length > 0;
  }

  get children(): CategoryDto[] {
    return this.category.childCategories || this.category.childCategories || [];
  }

  get childCount(): number {
    return this.children.length;
  }

  get isExpanded(): boolean {
    return this.expandedCategories.has(this.category.id);
  }

  toggleExpanded(): void {
    this.toggleExpandedChange.emit(this.category.id);
  }

  addSubcategory(parentCategory: CategoryDto | null = null): void {
    debugger

    const dialogRef = this.dialog.open(CreateCategoryDialogComponent, {
      width: '600px',
      data: { parentCategory }
    });

    dialogRef.componentInstance.createCategoryClick.subscribe((dto: CreateCategoryDto) => {
      this.store.dispatch(new CreateCategoryAction({ dto }));
      this.actions$
        .pipe(ofActionSuccessful(CreateCategorySuccessAction))
        .subscribe(() => dialogRef.close());
    });
  }

  editCategory(): void {
    const updateDto: UpdateCategoryDto = {
      name: this.category.name,
      // Add other properties as needed
    };
    this.editCategoryClick.emit({ dto: updateDto, id: this.category.id });
  }

  deleteCategory(event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete "${this.category.name}"?`)) {
      this.deleteCategoryClick.emit(this.category.id);
    }
  }

  // Event bubbling methods
  onToggleExpandedChange(categoryId: number): void {
    this.toggleExpandedChange.emit(categoryId);
  }

  onAddCategoryClick(dto: CreateCategoryDto): void {
    this.addCategoryClick.emit(dto);
  }

  onEditCategoryClick(event: { dto: UpdateCategoryDto, id: number }): void {
    this.editCategoryClick.emit(event);
  }

  onDeleteCategoryClick(categoryId: number): void {
    this.deleteCategoryClick.emit(categoryId);
  }
}