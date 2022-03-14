import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMendozarqComponent } from './reporte-mendozarq.component';

describe('ReporteMendozarqComponent', () => {
  let component: ReporteMendozarqComponent;
  let fixture: ComponentFixture<ReporteMendozarqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteMendozarqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMendozarqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
