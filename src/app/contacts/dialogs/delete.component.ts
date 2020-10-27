import {Component, Inject, OnDestroy} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Contact } from 'src/app/interfaces/contact.interface';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'contact-form-dialog',
  template: `
    <h1 mat-dialog-title>Контакт</h1>
    <div mat-dialog-content>
        <p>Вы действительно хотите удалить контакт(ы)?</p>
    </div>
    <div mat-dialog-actions>
        <button mat-button (click)="onNoClick()">Закрыть</button>
        <button mat-button (click)="delete()" cdkFocusInitial>Подтвердить</button>
    </div>
  `
})
export class DeleteDialog implements OnDestroy {

    private unsubscribe$ = new Subject<void>();

    constructor(
        private contactsService: ContactsService,
        public dialogRef: MatDialogRef<DeleteDialog>,
        @Inject(MAT_DIALOG_DATA) public data: Contact[]) {}

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public delete(): void {
        this.data.map(element => {
            this.contactsService.deleteContact(element.id)
            .pipe(
                takeUntil( this.unsubscribe$)
            )
            .subscribe();
        });
        
        this.onNoClick();
    }

}
