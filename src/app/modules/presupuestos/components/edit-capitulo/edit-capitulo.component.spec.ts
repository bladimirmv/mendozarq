import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCapituloComponent } from './edit-capitulo.component';

describe('EditCapituloComponent', () => {
  let component: EditCapituloComponent;
  let fixture: ComponentFixture<EditCapituloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCapituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCapituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
