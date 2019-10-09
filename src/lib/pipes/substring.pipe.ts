import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'substring'
})

/**
 * Moment Pipe is formatting time in string format by moment class
 */
export class SubstringPipe implements PipeTransform {

  /**
   * Transform pipe
   *
   * @param value String date/time value
   * @param inputFormat Input format of date/time value
   */
  transform(value: any, count: number): any {

    return value.substring(0, count);
  }


}
