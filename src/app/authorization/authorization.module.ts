import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationComponent } from './authorization.component';
import { AuthorizationRoutingModule } from './authorization-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AuthorizationRoutingModule
  ],
  declarations: [AuthorizationComponent]
})
export class AuthorizationModule { }
