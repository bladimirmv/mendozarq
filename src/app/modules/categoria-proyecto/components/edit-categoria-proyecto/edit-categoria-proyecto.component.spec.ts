import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoriaProyectoComponent } from './edit-categoria-proyecto.component';

describe('EditCategoriaProyectoComponent', () => {
  let component: EditCategoriaProyectoComponent;
  let fixture: ComponentFixture<EditCategoriaProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoriaProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoriaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
