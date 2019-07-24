import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'unisys-core-dumperson',
  templateUrl: './dumperson.component.html',
  styleUrls: ['./dumperson.component.css']
})
export class DumpersonComponent implements OnInit {

  @Input('object') object;

  constructor() {
  }

  ngOnInit() {
  }

}
