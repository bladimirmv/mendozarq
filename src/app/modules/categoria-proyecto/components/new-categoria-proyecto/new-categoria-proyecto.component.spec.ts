import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoriaProyectoComponent } from './new-categoria-proyecto.component';

describe('NewCategoriaProyectoComponent', () => {
  let component: NewCategoriaProyectoComponent;
  let fixture: ComponentFixture<NewCategoriaProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCategoriaProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCategoriaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
