import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroRua } from './cadastro-rua';

describe('CadastroRua', () => {
  let component: CadastroRua;
  let fixture: ComponentFixture<CadastroRua>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroRua]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroRua);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
