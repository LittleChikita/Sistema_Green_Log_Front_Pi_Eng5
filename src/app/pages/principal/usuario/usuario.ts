import {Component, OnInit} from '@angular/core';
import {Toast} from 'primeng/toast';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Button} from 'primeng/button';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {NgForOf, NgIf} from '@angular/common';
import {TableModule} from 'primeng/table';
import {Toolbar} from 'primeng/toolbar';
import {Password} from 'primeng/password';
import {UsuarioResponse} from '../../../models/UsuarioResponse';
import {UsuarioService} from '../../../services/usuario-service';
import {Iterator} from '../../../utils/PadraoDeProjeto/Iterator';

@Component({
  selector: 'app-usuario',
  imports: [
    Toast,
    Button,
    ConfirmDialog,
    Dialog,
    FormsModule,
    InputText,
    NgIf,
    TableModule,
    Toolbar,
    Password,
    NgForOf
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.scss',
})
export class Usuario implements OnInit{

  usuarioForm: any ={
    nome: '',
    email: '',
    senha: ''
  }

  usuarioDialog: boolean = false
  enviado: boolean = false

  usuarios: UsuarioResponse[] = []
  usuarioSelecionado!: UsuarioResponse

  usuarioIterator!: Iterator<UsuarioResponse>;
  usuariosFiltrados: UsuarioResponse[] = [];

  constructor(
    private service: UsuarioService,
    private msg: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.carregarUsuarios()
  }

  openNovo(){
    this.usuarioForm = { nome: "", email: "", senha: "" };
    this.usuarioDialog = true;
    this.enviado = false;
  }

  carregarUsuarios(){
    this.service.getUsuarios().subscribe({
      next: (lista) => {
        this.usuarios = lista;

        this.usuarioIterator = new Iterator(lista);

        this.usuariosFiltrados = lista;
      },
      error: () => {
        this.msg.add({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar Usuários."
        });
      }
    });
  }

  deletarUsuario(usuario: UsuarioResponse){
    if (!usuario) return;

    this.confirmationService.confirm({
      message: `Deseja realmente deletar ${usuario.nome}?`,
      accept: () => {
        this.service.deletar(usuario.id).subscribe({
          next: () => {
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Usuário deletado'
            });
            this.carregarUsuarios();
          },
          error: () => {
            this.msg.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Falha ao deletar'
            });
          }
        });
      }
    });
  }

  fecharDialog(){
    this.usuarioDialog = false;
  }

  editarUsuario(usuario: UsuarioResponse){
    this.usuarioForm = {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      senha: ""
    };
    this.usuarioDialog = true;
  }

  salvar(){
    this.enviado = true;

    if (!this.usuarioForm.nome || !this.usuarioForm.email) return;

    if (this.usuarioForm.id) {
      this.service.atualizar(this.usuarioForm.id, this.usuarioForm).subscribe({
        next: () => {
          this.msg.add({
            severity: "success",
            summary: "Atualizado",
            detail: "Usuário atualizado com sucesso"
          });
          this.usuarioDialog = false;
          this.carregarUsuarios();
        }
      });
      return;
    }

    this.service.criar(this.usuarioForm).subscribe({
      next: () => {
        this.msg.add({
          severity: "success",
          summary: "Criado",
          detail: "Usuário criado com sucesso"
        });
        this.usuarioDialog = false;
        this.carregarUsuarios();
      }
    });
  }

  //Iterator
  filtrarPorLetra(letra: string) {
    this.usuarioIterator.reset();
    const filtrados: UsuarioResponse[] = [];

    let atual = this.usuarioIterator.current();
    if (atual.nome.toLowerCase().startsWith(letra.toLowerCase())) {
      filtrados.push(atual);
    }

    while (this.usuarioIterator.hasNext()) {
      atual = this.usuarioIterator.next()!;
      if (atual.nome.toLowerCase().startsWith(letra.toLowerCase())) {
        filtrados.push(atual);
      }
    }

    this.usuariosFiltrados = filtrados;
  }

  letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letraSelecionada = '';


}
