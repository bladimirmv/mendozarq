import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUsuarioVisitaComponent } from './new-usuario-visita.component';

describe('NewUsuarioVisitaComponent', () => {
  let component: NewUsuarioVisitaComponent;
  let fixture: ComponentFixture<NewUsuarioVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUsuarioVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUsuarioVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
