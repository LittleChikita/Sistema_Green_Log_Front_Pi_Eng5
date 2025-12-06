import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPontoDeColeta } from './cadastro-ponto-de-coleta';

describe('CadastroPontoDeColeta', () => {
  let component: CadastroPontoDeColeta;
  let fixture: ComponentFixture<CadastroPontoDeColeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPontoDeColeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPontoDeColeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
