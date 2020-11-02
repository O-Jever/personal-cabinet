import {Component, Inject, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactsService } from 'src/app/services/contacts.service';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'contact-form-dialog',
  template: `
    <h1 mat-dialog-title>Контакт</h1>
    <div mat-dialog-content>
        <form [formGroup]="contactForm">
            <mat-form-field>
                <mat-label>Имя</mat-label>
                <input formControlName="name" matInput>
                <mat-error *ngIf="contactForm.get('name').invalid">{{getNameErrorMessage()}}</mat-error>
            </mat-form-field>
            <mat-form-field>
                <mat-label>Телефон</mat-label>
                <input formControlName="phone" matInput>
                <mat-error *ngIf="contactForm.get('phone').invalid">{{getPhoneErrorMessage()}}</mat-error>
            </mat-form-field>
            <mat-form-field>
                <mat-label>Почта</mat-label>
                <input formControlName="email" matInput>
                <mat-error *ngIf="contactForm.get('email').invalid">{{getEmailErrorMessage()}}</mat-error>
            </mat-form-field>
        </form>
    </div>
    <div mat-dialog-actions>
        <button mat-button (click)="close()">Закрыть</button>
        <button mat-button (click)="setContact()" [disabled]="!contactForm.valid">Подтвердить</button>
    </div>
  `,
  styles: [
      `
        form > mat-form-field {
            width: 100%;
        }

        .mat-dialog-actions {
            float: right;
        }
      `
  ]
})
export class ContactFormDialog implements OnDestroy {

    public contactForm: FormGroup;
    private id;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private contactsService: ContactsService,
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ContactFormDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Contact) {
            this.contactForm = new FormGroup({
                name: new FormControl('', Validators.required),
                phone: new FormControl('', [
                    Validators.required,
                    Validators.pattern(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/)
                ]),
                email: new FormControl('', [
                    Validators.required,
                    Validators.email
                ]),
            });

            if (data.id) {
                this.id = data.id;
                delete data.user;
                delete data.id;

                this.contactForm.setValue(data);
            }
            
        }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    
    public close(): void {
        this.dialogRef.close();
    }
    

    public getNameErrorMessage() {
        return this.contactForm.get('name').hasError('required') ? 'Это поле обязательное для заполнения' : '';
    }

    public getPhoneErrorMessage() {
        if (this.contactForm.get('phone').hasError('pattern')) {
            return 'Введенное значение не соответствует шаблону';
        }

        return this.contactForm.get('phone').hasError('required') ? 'Это поле обязательное для заполнения' : '';
    }

    public getEmailErrorMessage() {
        if (this.contactForm.get('email').hasError('email')) {
            return 'Введенное значение не соответствует e-mail';
        }

        return this.contactForm.get('email').hasError('required') ? 'Это поле обязательное для заполнения' : '';
    }

    public setContact(): void {
        if (this.id) {
            this.contactsService.changeContact(this.id, this.contactForm.value).subscribe(
                () => {
                    this.close();
                },
                error => {
                    this.errorMessage(error.message);
                }
            );
        } else {
            const contact = this.contactForm.value;
            contact.user = this.data.user;
            this.contactsService.setContact(contact)
            .pipe(
                takeUntil( this.unsubscribe$)
            )
            .subscribe(
                () => {
                    this.close();
                },
                error => {
                    this.errorMessage(error.message);
                }
            );
        }
    }

    private errorMessage(message): void {
        this._snackBar.open(message, 'Закрыть', {
          duration: 3000,
          verticalPosition: 'top',
        });
      } 

}
