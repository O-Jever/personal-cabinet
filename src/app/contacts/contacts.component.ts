import { SelectionModel } from '@angular/cdk/collections';
import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from '../interfaces/contact.interface';
import { ContactsService } from '../services/contacts.service';
import { MatDialog } from '@angular/material/dialog';
import { ContactFormDialog } from './dialogs/contact-form.component';
import { MatTable } from '@angular/material/table';
import { DeleteDialog } from './dialogs/delete.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { pipe, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['select', 'name', 'phone', 'email'];
  public contacts;
  public dataSource: MatTableDataSource<Contact>;
  public selection = new SelectionModel<Contact>(true, []);
  private sessionStorage: Storage;
  private unsubscribe$ = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;

  constructor(private contactsService: ContactsService, 
    public dialog: MatDialog, 
    private matPaginatorIntl: MatPaginatorIntl) { 
    this.sessionStorage = window.sessionStorage;
    this.matPaginatorIntl.itemsPerPageLabel = 'Кол-во элементов на стр.';
  }

  ngOnInit() {
    this.getContacts();
    this.matPaginatorIntl.itemsPerPageLabel = 'Кол-во элементов на стр.';
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getContacts(): void {
    this.contactsService.getContacts(this.sessionStorage.getItem('user'))
      .pipe(
        takeUntil( this.unsubscribe$)
      )
      .subscribe(responce => {
        this.dataSource = new MatTableDataSource<Contact>(responce);
        this.dataSource.paginator = this.paginator;
      });
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  public isChangeButtonDisabled(): boolean {
    return this.selection.selected.length !== 1;
  }

  public isDeleteButtonDisabled(): boolean {
    return this.selection.selected.length < 1;
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addContact(): void {
    const dialogRef = this.openDialog({ user: this.sessionStorage.getItem('user') });
    this.afterClosed(dialogRef);
  }

  public changeContact(): void {
    const dialogRef =  this.openDialog(this.selection.selected[0]);
    this.afterClosed(dialogRef);
  }

  public deleteContact(): void {
    const dialogRef = this.dialog.open(DeleteDialog, {
      width: '350px',
      data: this.selection.selected
    });
    this.afterClosed(dialogRef);
  }

  private openDialog(data) {
    return this.dialog.open(ContactFormDialog, {
      width: '350px',
      data: data
    });
  }

  private afterClosed(dialogRef) {
    dialogRef.afterClosed()
    .pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe(() => {
      this.getContacts();
      if (this.selection.selected.length !== 0) this.selection.clear();
    });
  }

}
