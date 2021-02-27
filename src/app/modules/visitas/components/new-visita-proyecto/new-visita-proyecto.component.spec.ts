import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVisitaProyectoComponent } from './new-visita-proyecto.component';

describe('NewVisitaProyectoComponent', () => {
  let component: NewVisitaProyectoComponent;
  let fixture: ComponentFixture<NewVisitaProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVisitaProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVisitaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
