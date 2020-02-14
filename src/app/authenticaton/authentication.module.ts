import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const components = [
  ForgotPasswordComponent,
  SignInComponent,
  SignUpComponent,
  VerifyEmailComponent
];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sign-in',
        component: SignInComponent
      },
      {
        path: 'register-user',
        component: SignUpComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'verify-email-address',
        component: VerifyEmailComponent
      },
      { path: '', redirectTo: 'sign-in', pathMatch: 'full' }
    ]),
    CommonModule,
    RouterModule
  ],
  declarations: [
    ...components
  ],
  exports: [
    ...components
  ],
  providers: []
})
export class AuthenticationModule { }
