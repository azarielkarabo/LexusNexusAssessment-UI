import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { CategoryState } from "./category.state";

@NgModule({
    imports: [CommonModule, NgxsModule.forFeature([CategoryState])]
})
export class CategoryStoreModule { }