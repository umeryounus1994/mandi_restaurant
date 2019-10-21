import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {

  barName = "";
  
  constructor() { }

  ngOnInit() {
    this.barName = JSON.parse(localStorage.getItem("bar")).barName;
  }

}
