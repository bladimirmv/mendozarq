import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCapituloPlanificacionComponent } from './new-capitulo-planificacion.component';

describe('NewCapituloPlanificacionComponent', () => {
  let component: NewCapituloPlanificacionComponent;
  let fixture: ComponentFixture<NewCapituloPlanificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCapituloPlanificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCapituloPlanificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
