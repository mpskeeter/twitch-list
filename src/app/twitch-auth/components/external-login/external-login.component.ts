import { Component, OnInit } from '@angular/core';
import { TwitchAuthService } from '../../services';

@Component({
  selector: 'app-external-login',
  templateUrl: './external-login.component.html',
  styleUrls: ['./external-login.component.scss'],
})
export class ExternalLoginComponent implements OnInit {
  constructor(private auth: TwitchAuthService) {}

  ngOnInit() {
    window.location.href = this.auth.authorizeUrl();
  }
}
