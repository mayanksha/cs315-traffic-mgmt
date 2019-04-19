import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceDashboardComponent } from './police-dashboard.component';

describe('PoliceDashboardComponent', () => {
  let component: PoliceDashboardComponent;
  let fixture: ComponentFixture<PoliceDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliceDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
