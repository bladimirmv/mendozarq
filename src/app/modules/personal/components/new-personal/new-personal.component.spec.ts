import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPersonalComponent } from './new-personal.component';

describe('NewPersonalComponent', () => {
  let component: NewPersonalComponent;
  let fixture: ComponentFixture<NewPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
