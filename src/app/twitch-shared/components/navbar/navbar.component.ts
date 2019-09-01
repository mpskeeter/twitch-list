import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TwitchAuthService, TwitchLocalStorageService } from '../../services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [TwitchAuthService],
})
export class NavbarComponent implements OnInit {
  constructor(public auth: TwitchAuthService, private router: Router, public storage: TwitchLocalStorageService) {}
  ngOnInit() {}

  login = () => {
    this.router.navigateByUrl('/externalLogin');
  };

  logout = () => {
    this.storage.logout();
    this.router.navigateByUrl('/');
  };
}
