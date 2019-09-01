// import * as $ from 'jquery';
import { Component } from '@angular/core';
import { MenuItems } from '../../services';

/** @title Responsive sidenav */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'full-layout',
  templateUrl: 'full.component.html',
  styleUrls: ['full.component.scss'],
})
export class FullComponent {
  constructor(public menuItems: MenuItems) {}
}
