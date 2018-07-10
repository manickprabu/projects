import { HttpClient } from '@angular/common/http';
import { Injectable, Input, EventEmitter } from '@angular/core';
 

export class SearchPattern {
  public searchKey:string = '';
  public pageLimit:number;
  public pageOffset:number = 1;
  public totalCount:number;

  constructor(totalCount:number, pageLimit:number, pageOffset:number, searchKey?:string) {
    this.totalCount = totalCount;
    this.pageLimit = pageLimit;
    this.pageOffset = pageOffset;
    this.searchKey = searchKey;
  }

  public next() {
    if( (this.pageOffset+1) * this.pageLimit < this.totalCount) {
      this.pageOffset++;
    }
  }

  public prev() {
    if( (this.pageOffset-1) * this.pageLimit >= 0) {
      this.pageOffset--;
    }
  }
}


export class ImageItem {
  public id:number;
  public title:string;
  public thumbnailUrl:string;
  public url:string;
  public albumId:string;
}


module Runpath.Interfaces {

  export interface IDatastoreService {
    getData():Array<any>;
    searchPattern:SearchPattern;
    updateSearchKey(key):void;
    //ON_READY:EventEmitter<ImageItem>;
    UPDATE_RESULT:EventEmitter<ImageItem>;
  }
}


@Injectable()
export class DatastoreService  implements Runpath.Interfaces.IDatastoreService {

  private readonly URL:string = "http://jsonplaceholder.typicode.com/photos";

  public searchPattern:SearchPattern
  //public ON_READY:EventEmitter<ImageItem> = new EventEmitter();
  public UPDATE_RESULT:EventEmitter<any> = new EventEmitter();

  private dataStore: Array<ImageItem>;

  constructor( private http:HttpClient) { 
    //this.loadData();
  }

  public getData():Array<ImageItem> {
    return this.dataStore;
  }

  public loadData():void {
    this.http.get(this.URL).subscribe( this.onDataReady.bind(this) );
  }

  private onDataReady(data:Array<ImageItem>):void {
    console.log('Raw Data', data);

    this.dataStore = data;
    this.searchPattern = new SearchPattern(data.length, 20, 0);
    this.updateResult();

    //this.ON_READY.emit(data);
  }

  public updateSearchKey(key):void {
    if(key !== undefined) {
      this.searchPattern.searchKey = key;
      this.searchPattern.pageOffset = 0;
      this.updateResult();
    }
  }

  private updateResult():void {
      console.log('searchPatterh', this.searchPattern);

      let updatedResult:Array<ImageItem> = this.dataStore;

      //apply search key
      if(this.searchPattern.searchKey !== undefined) {
        updatedResult = updatedResult.filter( (item) => {
          return item.title.toLowerCase().includes(this.searchPattern.searchKey);
        });
      }

      console.log('aa', updatedResult);
      //apply pagination;
      if(updatedResult) {
        updatedResult = updatedResult.slice(this.searchPattern.pageOffset * this.searchPattern.pageLimit, (this.searchPattern.pageOffset + 1) * this.searchPattern.pageLimit);
      }
      
      console.log('Updated Result', updatedResult);

      this.UPDATE_RESULT.emit(updatedResult);
  }

  public navigateList(value):void {
    switch(value) {
      case 'next':
        this.searchPattern.next();
        break;
      case 'previous':
        this.searchPattern.prev();
        break;
    }

    this.updateResult();
  }

}
