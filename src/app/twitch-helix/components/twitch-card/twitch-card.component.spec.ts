import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitchCardComponent } from './twitch-card.component';

describe('TwitchCardComponent', () => {
  let component: TwitchCardComponent;
  let fixture: ComponentFixture<TwitchCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitchCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitchCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
