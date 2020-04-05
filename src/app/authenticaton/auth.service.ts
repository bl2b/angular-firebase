import { Injectable, NgZone } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from './user';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginRequest } from './loginrequest';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    private toastr: ToastrService,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private http: HttpClient
  ) {

  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['book']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        this.toastr.warning(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
      }).catch((error) => {
        this.toastr.warning(error.message);
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        this.toastr.success('Password reset email sent, check your inbox.');
      }).catch((error) => {
        this.toastr.warning(error);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    // const user = JSON.parse(localStorage.getItem('jwt'));
    const token = localStorage.getItem('jwt');
    if (token) {
      // if (user.emailVerified === false && user.providerData[0].providerId === 'password') {
      //   this.toastr.warning('We sent verifcation to your email. Please have it complete.');
      //   return false;
      // }
      return true;
    } else {
      return false;
    }
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Sign in with Facebook
  FacebookAuth() {
    return this.AuthLogin(new auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['book']);
        });
        this.SetUserData(result.user);
      }).catch((error) => {
        this.toastr.warning(error);
      });
  }

  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    this.userData = user;
    localStorage.setItem('user', JSON.stringify(this.userData));

    user.getIdToken().then((theToken) => {
      localStorage.setItem('jwt', theToken);
      // const reqHeader = new HttpHeaders({
      //   'Content-Type': 'application/json',
      //   'Authorization': 'Bearer ' + theToken
      // });
      // this.http.get('/api/values/secrets', { headers: reqHeader }).subscribe({
      //     next: () => {
      //       this.toastr.success('Auth');
      //       // let theUser = new CurrentUser();
      //       // theUser.displayName = firebaseUser.displayName;
      //       // theUser.email = firebaseUser.email;
      //       // theUser.isSignedIn = true;
      //       // localStorage.setItem("jwt", theToken);
      //       // this.user$.next(theUser);
      //     },
      //     error: (err) => {
      //       console.log('inside the error from server', err);
      //       // this.doSignedOutUser()
      //     }
      //   });
      // this.http.post('/api/values/verify', { token: theToken }).subscribe({
      //   next: () => {
      //     this.toastr.success('Auth');
      //     // let theUser = new CurrentUser();
      //     // theUser.displayName = firebaseUser.displayName;
      //     // theUser.email = firebaseUser.email;
      //     // theUser.isSignedIn = true;
      //     // localStorage.setItem("jwt", theToken);
      //     // this.user$.next(theUser);
      //   },
      //   error: (err) => {
      //     // console.log('inside the error from server', err);
      //     // this.doSignedOutUser()
      //   }
      // });
    }, (failReason) => {
      // this.doSignedOutUser();
    });


    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  SignOut() {
    // return this.afAuth.auth.signOut().then(() => {
    //   localStorage.removeItem('user');
    //   this.router.navigate(['sign-in']);
    // });
    localStorage.removeItem('jwt');
    this.router.navigate(['sign-in']);
  }

  SignInViaApi(user, pass): Observable<string> {
    const req: LoginRequest = {
      username: user,
      password: pass
    };
    return this.http.post('/api/authentication/login', req).pipe(
      map((res: any) => {
        return res.token;
      })
    );
  }

}
