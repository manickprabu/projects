import { DatastoreService } from './../../services/datastore.service';
import { Component, OnInit } from '@angular/core';
 

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private dataStore:DatastoreService) { 
    console.log('updateSearchKey');
  }

  ngOnInit() {
  }

  private updateSearchKey($event) {
    console.log('updateSearchKey', $event.target.value);

    this.dataStore.updateSearchKey($event.target.value);
  }

}
