import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCitizenComponent } from './create-citizen.component';

describe('CreateCitizenComponent', () => {
  let component: CreateCitizenComponent;
  let fixture: ComponentFixture<CreateCitizenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCitizenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCitizenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
