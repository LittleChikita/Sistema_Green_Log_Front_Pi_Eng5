import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rua } from './rua';

describe('Rua', () => {
  let component: Rua;
  let fixture: ComponentFixture<Rua>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rua]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rua);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
