import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatTableModule } from '@angular/material/table'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card'
import { MatPaginatorModule } from '@angular/material/paginator'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxsStoreModule } from 'src/ngxs-store/ngxs-store.module';
import { TableService } from 'src/serivces/table.services';
import { CategoriesApiService } from 'src/serivces/category.service';
import { ProductsApiService } from 'src/serivces/product.service';
import { CreateProductDialogComponent } from './products/components/create-product-dialog/create-product-dialog.component';
import { UpdateProductDialogComponent } from './products/components/update-product-dialog/update-product-dialog.component';
import { DeleteProductDialogComponent } from './products/components/delete-product-dialog/delete-product-dialog.component';
import { ProductListPageComponent } from './products/pages/product-list-page.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './products/components/product-list/product-list.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateProductDialogComponent,
    UpdateProductDialogComponent,
    DeleteProductDialogComponent,
    ProductListComponent,
    ProductListPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    BrowserAnimationsModule,
    NgxsStoreModule
  ],
  providers: [
    CategoriesApiService,
    ProductsApiService,
    TableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
