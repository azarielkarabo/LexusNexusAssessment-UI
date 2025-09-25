import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { ProductState } from "./product.state";

@NgModule({
    imports:[CommonModule,NgxsModule.forFeature([ProductState])]
})
export class ProductStoreModule {}