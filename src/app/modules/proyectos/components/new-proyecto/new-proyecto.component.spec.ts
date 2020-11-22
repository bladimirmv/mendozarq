import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProyectoComponent } from './new-proyecto.component';

describe('NewProyectoComponent', () => {
  let component: NewProyectoComponent;
  let fixture: ComponentFixture<NewProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
