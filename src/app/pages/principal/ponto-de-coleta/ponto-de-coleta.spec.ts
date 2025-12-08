import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PontoDeColeta } from './ponto-de-coleta';

describe('PontoDeColeta', () => {
  let component: PontoDeColeta;
  let fixture: ComponentFixture<PontoDeColeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PontoDeColeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PontoDeColeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
