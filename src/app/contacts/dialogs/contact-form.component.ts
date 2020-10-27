import {Component, Inject} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactsService } from 'src/app/services/contacts.service';
import * as _ from 'lodash';

@Component({
  selector: 'contact-form-dialog',
  template: `
    <h1 mat-dialog-title>Контакт</h1>
    <div mat-dialog-content>
        <form [formGroup]="contactForm">
            <mat-form-field>
                <mat-label>Имя</mat-label>
                <input formControlName="name" matInput>
            </mat-form-field>
            <mat-form-field>
                <mat-label>Телефон</mat-label>
                <input formControlName="phone" matInput>
            </mat-form-field>
            <mat-form-field>
                <mat-label>Почта</mat-label>
                <input formControlName="email" matInput>
            </mat-form-field>
        </form>
    </div>
    <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Закрыть</button>
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
export class ContactFormDialog {

    public contactForm: FormGroup;
    private id;
    //[mat-dialog-close]="contactForm.value"

    constructor(
        private contactsService: ContactsService,
        public dialogRef: MatDialogRef<ContactFormDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Contact) {
            this.contactForm = new FormGroup({
                name: new FormControl('', Validators.required),
                phone: new FormControl('', Validators.required),
                email: new FormControl('', Validators.required),
            });

            if (data.id) {
                this.id = data.id;
                delete data.user;
                delete data.id;

                this.contactForm.setValue(data);
            }
            
        }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public setContact(): void {
        if (this.id) {
            this.contactsService.changeContact(this.id, this.contactForm.value).subscribe();
        } else {
            const contact = this.contactForm.value;
            contact.user = this.data.user;
            this.contactsService.setContact(contact).subscribe();
        }
        
        this.onNoClick();
    }

}
