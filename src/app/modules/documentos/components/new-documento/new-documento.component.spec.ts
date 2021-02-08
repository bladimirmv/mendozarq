import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDocumentoComponent } from './new-documento.component';

describe('NewDocumentoComponent', () => {
  let component: NewDocumentoComponent;
  let fixture: ComponentFixture<NewDocumentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDocumentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
