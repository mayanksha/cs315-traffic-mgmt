import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenDashboardComponent } from './citizen-dashboard.component';

describe('CitizenDashboardComponent', () => {
  let component: CitizenDashboardComponent;
  let fixture: ComponentFixture<CitizenDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitizenDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitizenDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
