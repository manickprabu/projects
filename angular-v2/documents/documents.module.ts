import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { ListModule } from '../shared/list/list.module';

import { FileUploadComponent } from './file-upload/file-upload.component';
import { DocumentService } from './shared/document.service';
import { FileReaderService } from './shared/file-reader.service';
import { AppConfig } from '../core/config/app.config';

@NgModule({
  declarations: [
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    SharedModule,
    FormsModule,
    ListModule,
    ReactiveFormsModule
  ],
  providers: [
    DocumentService,
    FileReaderService
  ]
})
export class DocumentsModule { }
