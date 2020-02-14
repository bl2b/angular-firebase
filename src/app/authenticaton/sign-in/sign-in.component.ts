import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/authenticaton/auth.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {
  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit() {
   }
}
