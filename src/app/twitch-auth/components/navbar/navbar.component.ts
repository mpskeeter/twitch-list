import { Component, OnInit } from '@angular/core';
import { TwitchAuthService } from '../../services';
import { Router } from '@angular/router';
import { TwitchLocalStorageService } from '../../../twitch-shared/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [TwitchAuthService],
})
export class NavbarComponent implements OnInit {
  constructor(private auth: TwitchAuthService, private router: Router, private storage: TwitchLocalStorageService) {}
  ngOnInit() {}

  login = () => {
    this.router.navigateByUrl('/externalLogin');
  };

  logout = () => {
    this.storage.logout();
    this.router.navigateByUrl('/home');
  };
}
