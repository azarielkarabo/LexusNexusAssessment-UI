import { NgModule } from "@angular/core";
import { CategoryTreePageComponent } from "./pages/category-tree-page.component";
import { CategoryTreeComponent } from "./components/category-tree/category-tree.component";
import { CategoriesApiService } from "src/serivces/category.service";
import { CategoryRoutingModule } from "./category-routing.module";
import { CreateCategoryDialogComponent } from "./components/create-category-dialog/create-category-dialog.component";
import { HttpClientModule } from "@angular/common/http";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTreeModule } from "@angular/material/tree";
import { MaterialModule } from "src/material/material-module";
import { NgxsStoreModule } from "src/ngxs-store/ngxs-store.module";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [CategoryRoutingModule,
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatTableModule,
        MatToolbarModule,
        MatIconModule,
        MatCardModule,
        MatPaginatorModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatTreeModule,
        MaterialModule,
        NgxsStoreModule],
    declarations: [CategoryTreePageComponent, CategoryTreeComponent, CreateCategoryDialogComponent],
    exports: [],
    providers: [CategoriesApiService]
})
export class CategoryModule { }