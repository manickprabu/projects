import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NotificationComponent } from './notification/notification.component';
import { FieldsComponent } from './fields/fields.component';
import { HttpClientService } from './http-client.service';

@NgModule({
    declarations: [
        NotificationComponent,
        FieldsComponent
    ],
    exports: [
        NotificationComponent,
        FieldsComponent
    ],
    imports: [
        BrowserModule, 
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        HttpClientService
    ]
})
export class SharedModule { }
