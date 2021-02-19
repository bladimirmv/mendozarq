import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUsuarioProyectoComponent } from './new-usuario-proyecto.component';

describe('NewUsuarioProyectoComponent', () => {
  let component: NewUsuarioProyectoComponent;
  let fixture: ComponentFixture<NewUsuarioProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUsuarioProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUsuarioProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
