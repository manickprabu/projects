import { Injectable } from '@angular/core';
import { FileDocument } from '../shared/filedata.model';

import { Observable } from 'rxjs/Observable';

declare let JSZip:any;
import '../../../../node_modules/jszip/dist/jszip.min.js';

@Injectable()
export class FileReaderService {

  ZIP_FILE:string = "application/zip";
  EMAIL_FILE:string = "application/email";

  constructor() { }

  getFileList(files) {

    return new Observable( observer => {
      
      let zips = this.filterFiles(files, this.ZIP_FILE);
      let mails = this.filterFiles(files, this.EMAIL_FILE);

      //extract if its zip file
      if(zips.length) {
        JSZip.loadAsync(zips[0]).then( zip => {
            observer.next(this.extractZip(zip));
        })
      } 

      //if its .msg file
      else if(mails.length) {
          observer.next(files);
      } 

      //retrn if there is no .zip files
      else { 
        observer.next(files);
      }
    });

  }

  filterFiles(files, format) {
    let filtered = [];

    for(let i=0; i<files.length; i++) {
      let file = files[i];
      if(file.type === format) {
        filtered.push(file);
      }
    }
    return filtered;
  }

  extractZip(ziped) {
    let files:Array<any> = [];
    for(var fileName in ziped.files) {
        let file = ziped.files[fileName];
        if(!file.dir) {
          console.log('aaa', file)
          file = new File([file._data.compressedContent], file.name);
          files.push( file );
        }
    }
    return files;
  }

  getFileDocument(document: File): FileDocument {
    let fileDoc: FileDocument = new FileDocument();
    fileDoc.type = document.type;
    fileDoc.name = document.name;
    fileDoc.size = document.size.toString();
    return fileDoc;
  }

}
