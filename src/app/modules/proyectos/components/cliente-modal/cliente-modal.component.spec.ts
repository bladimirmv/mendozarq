import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteModalComponent } from './cliente-modal.component';

describe('ClienteModalComponent', () => {
  let component: ClienteModalComponent;
  let fixture: ComponentFixture<ClienteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
