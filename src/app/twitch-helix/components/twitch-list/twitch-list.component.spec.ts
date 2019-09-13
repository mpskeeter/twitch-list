import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitchListComponent } from './twitch-list.component';

describe('TwitchListComponent', () => {
  let component: TwitchListComponent;
  let fixture: ComponentFixture<TwitchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
