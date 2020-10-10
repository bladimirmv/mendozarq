import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LirakiComponent } from './liraki.component';

describe('LirakiComponent', () => {
  let component: LirakiComponent;
  let fixture: ComponentFixture<LirakiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LirakiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LirakiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
