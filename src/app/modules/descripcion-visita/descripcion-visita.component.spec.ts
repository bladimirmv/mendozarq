import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescripcionVisitaComponent } from './descripcion-visita.component';

describe('DescripcionVisitaComponent', () => {
  let component: DescripcionVisitaComponent;
  let fixture: ComponentFixture<DescripcionVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescripcionVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescripcionVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
