import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarpetaComponent } from './edit-carpeta.component';

describe('EditCarpetaComponent', () => {
  let component: EditCarpetaComponent;
  let fixture: ComponentFixture<EditCarpetaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCarpetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCarpetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
