import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaRecursoComponent } from './categoria-recurso.component';

describe('CategoriaRecursoComponent', () => {
  let component: CategoriaRecursoComponent;
  let fixture: ComponentFixture<CategoriaRecursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaRecursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
