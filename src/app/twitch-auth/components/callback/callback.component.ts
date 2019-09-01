import { Component, OnInit } from '@angular/core';
import { TwitchAuthService } from '../../services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  constructor(private auth: TwitchAuthService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const token = params.code;
      const state = params.state;
      console.log('token: ', token);
      console.log('state: ', state);
      this.auth.acquireAccessToken(state, token);
      this.router.navigateByUrl('/twitch');
    });
  }
}
