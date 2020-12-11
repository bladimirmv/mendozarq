import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoriaRecursoComponent } from './new-categoria-recurso.component';

describe('NewCategoriaRecursoComponent', () => {
  let component: NewCategoriaRecursoComponent;
  let fixture: ComponentFixture<NewCategoriaRecursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCategoriaRecursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCategoriaRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
