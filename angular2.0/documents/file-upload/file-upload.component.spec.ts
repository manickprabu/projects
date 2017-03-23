/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DocumentService } from '../shared/document.service';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let comp: FileUploadComponent;
  let fixture: ComponentFixture<FileUploadComponent>;
  let activatedRouteStub: any;
  let documentServiceStub: any;

  beforeEach(() => {
    activatedRouteStub = {
      params: {
        subscribe: () => ({})
      }
    };
    documentServiceStub = {
      getMetaDataFields: () => ({
        subscribe: () => ({})
      }),
      getDocTypes: () => ({
        subscribe: () => ({})
      })
    };
    TestBed.configureTestingModule({
      declarations: [FileUploadComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: DocumentService, useValue: documentServiceStub }
      ]
    });
    fixture = TestBed.createComponent(FileUploadComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

});
