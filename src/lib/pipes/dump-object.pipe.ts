import {Pipe, PipeTransform} from '@angular/core';
import * as $ from 'jquery';

@Pipe({
  name: 'dumpObject'
})

/**
 * This pipe show debug for object in tree list
 *
 * Usage : <unisys-core-dumperson [object]:{}></unisys-core-dumperson>
 */
export class DumpObjectPipe implements PipeTransform {

  public array = ['<ul>'];
  public runnedTimes = 1;

  transform(value: any, args?: any): any {

    this.printList(value);
    this.array.push('</ul>');

    let html = '<div class="dumperson"><span class="dumperson-mini dumperson-title">DUMPERSON PIPE</span><span class="dumperson-mini dumperson-start">DEBUG START</span>';
    const object = Object.assign([], this.array);
    const joined = object.join('');
    html += joined;
    html += '<span class="dumperson-mini dumperson-end">DEBUG END</span></div>';

    this.array = ['<ul>'];

    return html;
  }

  public getChildren(parent) {

    for (const child in parent) {
      this.array.push('<li class="dumperson-child"><span class="dumperson-child-title">' + child + '</span><ul>');
      this.printList(parent[child]);
      this.array.push('</ul></li>');
    }
  }

  public printList(items) {

    switch ($.type(items)) {
      case 'object':
        this.getChildren(items);
        break;
      case 'string':
        this.array.push('<li class="dumperson-value"><span class="dumperson-type">(string:' + items.length + ')</span> ' + items + '</li>');
        break;
      case 'number':
        this.array.push('<li class="dumperson-value"><span class="dumperson-type">(number)</span> ' + items + '</li>');
        break;
      case 'boolean':
        let stringgedValue = '';

        if (items) {
          stringgedValue = 'true';
        } else {
          stringgedValue = 'false';
        }
        this.array.push('<li class="dumperson-value"><span class="dumperson-type">(bool)</span> ' + stringgedValue + '</li>');
        break;
      case 'array':
        this.getChildren(items);
        // this.printArray(items);
        break;
    }

  }

  public printArray(myArray) {
    for (let i = 0; i < myArray.length; i++) {
      this.array.push('<li>' + myArray[i] + '</li>');
    }
  }


}
