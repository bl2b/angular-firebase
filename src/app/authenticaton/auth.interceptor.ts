import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

constructor(private toastr: ToastrService,
            private authService: AuthService) {

}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt');
    let cloned;
    if (token) {
      const header = `Bearer ${token}`;
      cloned = req.clone({ headers: req.headers.set('Authorization', header) });
    }

    const request = cloned ? cloned : req;

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          errorMessage = `Error: ${err.error.message}`;
        } else {
          errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
        }

        this.toastr.error(errorMessage);
        this.authService.SignOut();
        return throwError(err);
      })
    );
  }
}
