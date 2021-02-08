import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarpetaComponent } from './new-carpeta.component';

describe('NewCarpetaComponent', () => {
  let component: NewCarpetaComponent;
  let fixture: ComponentFixture<NewCarpetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCarpetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCarpetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
