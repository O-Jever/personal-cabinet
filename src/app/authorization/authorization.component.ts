import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { AuthorizationService } from '../services/authorization.service';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  public loginForm: FormGroup;
  private sessionStorage: Storage;
  public return;

  constructor(
    private router: Router, 
    private authorizationService: AuthorizationService, 
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar) { 
    this.sessionStorage = window.sessionStorage;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      login: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    });
    this.route.queryParams.subscribe(params => this.return = params['return']);
  }


  public onSubmit(): void {
    this.authorizationService.authorization(this.loginForm.value).subscribe(
      (user: User) => {
        console.log('Ответ от сервера', user);
        this.sessionStorage.setItem('hash', user.hash);
        this.sessionStorage.setItem('user', user.login);
        this.router.navigateByUrl(this.return);
      },
      error => {
        this._snackBar.open(error.message, 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
      }
    );
  }

  public getErrorMessage() {
    return this.loginForm.get('login').hasError('required') 
      || this.loginForm.get('password').hasError('required') 
        ? 'Это поле обязательное для заполнения' : '';
  }
}
