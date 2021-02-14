import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarpetaProyectoComponent } from './carpeta-proyecto.component';

describe('CarpetaProyectoComponent', () => {
  let component: CarpetaProyectoComponent;
  let fixture: ComponentFixture<CarpetaProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarpetaProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarpetaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
