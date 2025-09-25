import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductListPageComponent } from "./pages/product-list-page.component";

const routes: Routes = [
  { path: '', component: ProductListPageComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }