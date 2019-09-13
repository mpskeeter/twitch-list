import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwitchStreamCardComponent } from './twitch-stream-card.component';

describe('TwitchStreamCardComponent', () => {
  let component: TwitchStreamCardComponent;
  let fixture: ComponentFixture<TwitchStreamCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwitchStreamCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwitchStreamCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
