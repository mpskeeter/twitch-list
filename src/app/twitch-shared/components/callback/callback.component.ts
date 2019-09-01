import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwitchAuthService } from '../../services';

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
      this.auth.acquireAccessToken(state, token);
      this.router.navigateByUrl('/twitch');
    });
  }
}
