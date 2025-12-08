import {Component, inject} from '@angular/core';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth-service';
import {ActivatedRoute, Router} from '@angular/router';
import {Password} from 'primeng/password';
import {ButtonDirective} from 'primeng/button';
import {InputText} from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [
    Toast,
    Password,
    ReactiveFormsModule,
    ButtonDirective,
    InputText
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private msg = inject(MessageService);

  loading = false;

  returnUrl: string = '/usuarios'; // rota padrão

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/usuarios';
  }

  login() {
    if (this.form.invalid) return;

    this.loading = true;

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;

        this.msg.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Login realizado com sucesso!',
        });

        this.router.navigateByUrl(this.returnUrl);
      },
      error: () => {
        this.loading = false;

        this.msg.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Credenciais inválidas',
        });
      }
    });
  }
}
