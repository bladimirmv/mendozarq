import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPersonalProyectoComponent } from './new-personal-proyecto.component';

describe('NewPersonalProyectoComponent', () => {
  let component: NewPersonalProyectoComponent;
  let fixture: ComponentFixture<NewPersonalProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPersonalProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPersonalProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
