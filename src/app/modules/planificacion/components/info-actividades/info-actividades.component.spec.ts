import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoActividadesComponent } from './info-actividades.component';

describe('InfoActividadesComponent', () => {
  let component: InfoActividadesComponent;
  let fixture: ComponentFixture<InfoActividadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoActividadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
