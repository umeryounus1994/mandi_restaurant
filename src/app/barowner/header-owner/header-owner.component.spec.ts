import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderOwnerComponent } from './header-owner.component';

describe('HeaderOwnerComponent', () => {
  let component: HeaderOwnerComponent;
  let fixture: ComponentFixture<HeaderOwnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderOwnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
