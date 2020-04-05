import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AuthService } from 'src/app/authenticaton/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit() {
  }

  login(user, pass) {
    this.authService.SignInViaApi(user, pass).subscribe(token => {
      localStorage.setItem('jwt', token);

      this.ngZone.run(() => {
        this.router.navigate(['book']);
      });
    });
  }
}
