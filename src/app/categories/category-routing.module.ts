import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CategoryTreePageComponent } from "./pages/category-tree-page.component";

const routes: Routes = [
  { path: '', component: CategoryTreePageComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }