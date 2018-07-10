import { DatastoreService, ImageItem } from './../../services/datastore.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private displayImageList:Array<any>;

  constructor(private dataStore: DatastoreService) {
    this.registerEvent();
  }

  ngOnInit() {
    this.dataStore.loadData();
  }

  private registerEvent():void {
    this.dataStore.UPDATE_RESULT.subscribe( this.updateResult.bind(this) );
  }

  private updateResult(result:Array<ImageItem>):void {
    console.log('FINAL', result);
    this.displayImageList = result;
  }

  private navigateList(value) {
    this.dataStore.navigateList(value);
  }

  get displayCurrentResult() {
    return `${this.dataStore.searchPattern.pageLimit * this.dataStore.searchPattern.pageOffset} of ${this.dataStore.searchPattern.totalCount}`
  }

}
