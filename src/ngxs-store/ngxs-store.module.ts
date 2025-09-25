import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NgxsReduxDevtoolsPluginModule } from "@ngxs/devtools-plugin";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { NgxsRouterPluginModule } from "@ngxs/router-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { NgxsModule } from "@ngxs/store";
import { ProductStoreModule } from "./product-store/product-store.module";
import { CategoryStoreModule } from "./category-store/category-store.module";

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forRoot([]),
    NgxsRouterPluginModule.forRoot(),
    NgxsFormPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule,
    NgxsStoragePluginModule,
    ProductStoreModule,
    CategoryStoreModule
  ],
  declarations: []
})
export class NgxsStoreModule { }