import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapProyectoComponent } from './map-proyecto.component';

describe('MapProyectoComponent', () => {
  let component: MapProyectoComponent;
  let fixture: ComponentFixture<MapProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
