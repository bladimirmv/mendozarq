import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCapituloPlanificacionComponent } from './edit-capitulo-planificacion.component';

describe('EditCapituloPlanificacionComponent', () => {
  let component: EditCapituloPlanificacionComponent;
  let fixture: ComponentFixture<EditCapituloPlanificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCapituloPlanificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCapituloPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
