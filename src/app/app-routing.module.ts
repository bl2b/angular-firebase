import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './authenticaton/sign-in/sign-in.component';
import { SecureInnerPagesGuard } from './authenticaton/secure-inner-pages.guard';
import { AuthGuard } from './authenticaton/auth.guard';
import { SignUpComponent } from './authenticaton/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './authenticaton/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './authenticaton/verify-email/verify-email.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';


// Include route guard in routes array
const routes: Routes = [
  {
    path: 'book',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: './books/book.module#BookModule'
      },
    ]
  },
  {
    path: 'pagenotfound',
    component: PagenotfoundComponent
  },
  { path: '', redirectTo: 'book', pathMatch: 'full' },
  {
    path: '',
    canActivate: [SecureInnerPagesGuard],
    children: [
      {
        path: '',
        loadChildren: './authenticaton/authentication.module#AuthenticationModule'
      },
    ]
  },
  { path: '**', redirectTo: 'pagenotfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
