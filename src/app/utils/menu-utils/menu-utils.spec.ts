import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUtils } from './menu-utils';

describe('MenuUtils', () => {
  let component: MenuUtils;
  let fixture: ComponentFixture<MenuUtils>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuUtils]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuUtils);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
