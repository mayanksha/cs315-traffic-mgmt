import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RtoDashboardComponent } from './rto-dashboard.component';

describe('RtoDashboardComponent', () => {
  let component: RtoDashboardComponent;
  let fixture: ComponentFixture<RtoDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RtoDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RtoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
