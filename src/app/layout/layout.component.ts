import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { MatSidenav, MatDialog } from '@angular/material';
import { AuthService } from '../authenticaton/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  constructor(
    private authService: AuthService,
    public dialog: MatDialog,
    private toastr: ToastrService
   ) {
  }

  opened = true;
  @ViewChild('sidenav') sidenav: MatSidenav;

  ngOnInit() {
    if (window.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
  }

  showLogoutDialog(content) {
    this.dialog.open(content, {
      width: '350px'
    });
  }

  logout() {
    this.authService.SignOut();
    this.dialog.closeAll();
    this.toastr.success('Successfully Logout');
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }

}
