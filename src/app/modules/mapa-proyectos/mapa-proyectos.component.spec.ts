import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaProyectosComponent } from './mapa-proyectos.component';

describe('MapaProyectosComponent', () => {
  let component: MapaProyectosComponent;
  let fixture: ComponentFixture<MapaProyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaProyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
