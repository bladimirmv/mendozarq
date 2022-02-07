import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCapituloComponent } from './new-capitulo.component';

describe('NewCapituloComponent', () => {
  let component: NewCapituloComponent;
  let fixture: ComponentFixture<NewCapituloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCapituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCapituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
