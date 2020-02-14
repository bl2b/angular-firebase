import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { AngularMaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    LayoutComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule
  ],
  exports: [
    LayoutComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutModule { }
