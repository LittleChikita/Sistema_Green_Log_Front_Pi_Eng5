import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroPontosDeColeta } from './cadastro-pontos-de-coleta';

describe('CadastroPontosDeColeta', () => {
  let component: CadastroPontosDeColeta;
  let fixture: ComponentFixture<CadastroPontosDeColeta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroPontosDeColeta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroPontosDeColeta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
