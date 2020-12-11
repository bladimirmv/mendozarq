import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRecursoComponent } from './new-recurso.component';

describe('NewRecursoComponent', () => {
  let component: NewRecursoComponent;
  let fixture: ComponentFixture<NewRecursoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRecursoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
