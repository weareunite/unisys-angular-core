import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
      public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.builForm();
  }

  defaultForm = new FormGroup ({
      smtp_username: new FormControl(),
      smtp_password: new FormControl(),
  });

  private builForm(){
      this.defaultForm = this.formBuilder.group({
          smtp_username: [{value:'', disabled: true}],
          smtp_password: [{value:'', disabled: true}],
      });
  }

  public onSubmit(){

  }

}
