import { NgModule } from "@angular/core";
import { CategoriesApiService } from "src/serivces/category.service";
import { ProductListComponent } from "./components/product-list/product-list.component";
import { ProductListPageComponent } from "./pages/product-list-page.component";
import { ProductRoutingModule } from "./product-routing.module";
import { CreateProductDialogComponent } from "./components/create-product-dialog/create-product-dialog.component";
import { UpdateProductDialogComponent } from "./components/update-product-dialog/update-product-dialog.component";
import { DeleteProductDialogComponent } from "./components/delete-product-dialog/delete-product-dialog.component";
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
import { BrowserModule } from "@angular/platform-browser";
import { MaterialModule } from "src/material/material-module";
import { NgxsStoreModule } from "src/ngxs-store/ngxs-store.module";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [ProductRoutingModule,
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
    declarations: [
        ProductListComponent,
        ProductListPageComponent,
        CreateProductDialogComponent,
        UpdateProductDialogComponent,
        DeleteProductDialogComponent],
    exports: [],
    providers: [CategoriesApiService]
})
export class ProductModule { }