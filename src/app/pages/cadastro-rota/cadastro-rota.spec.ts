import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroRota } from './cadastro-rota';

describe('CadastroRota', () => {
  let component: CadastroRota;
  let fixture: ComponentFixture<CadastroRota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroRota]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroRota);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
