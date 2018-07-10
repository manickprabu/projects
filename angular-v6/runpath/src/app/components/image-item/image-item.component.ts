import { ImageItem } from './../../services/datastore.service';
import { Component, OnInit, Output, Input } from '@angular/core';

@Component({
  selector: 'app-image-item',
  templateUrl: './image-item.component.html',
  styleUrls: ['./image-item.component.css']
})
export class ImageItemComponent implements OnInit {
  private data:ImageItem;

  @Input() mydata :ImageItem;

  constructor() {
  }

  ngOnInit() {
  }

}
