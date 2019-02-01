import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() footerYears: string;

  constructor() {
  }

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    this.footerYears = '2018 - ' + currentYear;
  }

}
