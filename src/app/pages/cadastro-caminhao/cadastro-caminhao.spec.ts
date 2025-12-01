import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroCaminhao } from './cadastro-caminhao';

describe('CadastroCaminhao', () => {
  let component: CadastroCaminhao;
  let fixture: ComponentFixture<CadastroCaminhao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroCaminhao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroCaminhao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
