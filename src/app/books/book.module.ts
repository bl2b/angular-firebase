import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BookListComponent } from './book-list/book-list.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../authenticaton/auth.guard';

import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
    declarations: [
        BookDetailComponent,
        BookListComponent
    ],
    imports: [
        RouterModule.forChild([
            {
              path: 'list',
              component: BookListComponent
            },
            {
              path: 'new',
              component: BookDetailComponent
            },
            {
              path: ':id',
              component: BookDetailComponent
            },
            { path: '', redirectTo: 'list' }
          ]),
          LayoutModule,
          CommonModule,
          AngularMaterialModule,
          FormsModule,
          ReactiveFormsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class BookModule { }