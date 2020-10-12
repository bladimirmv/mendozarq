import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaProyectoComponent } from './categoria-proyecto.component';

describe('CategoriaProyectoComponent', () => {
  let component: CategoriaProyectoComponent;
  let fixture: ComponentFixture<CategoriaProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriaProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
