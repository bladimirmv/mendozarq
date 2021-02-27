import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitaProyectoComponent } from './edit-visita-proyecto.component';

describe('EditVisitaProyectoComponent', () => {
  let component: EditVisitaProyectoComponent;
  let fixture: ComponentFixture<EditVisitaProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVisitaProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
