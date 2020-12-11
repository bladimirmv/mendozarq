import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoriaRecursoComponent } from './edit-categoria-recurso.component';

describe('EditCategoriaRecursoComponent', () => {
  let component: EditCategoriaRecursoComponent;
  let fixture: ComponentFixture<EditCategoriaRecursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoriaRecursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoriaRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
