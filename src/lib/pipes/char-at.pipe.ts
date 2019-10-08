import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'charat'
})

/**
 * Moment Pipe is formatting time in string format by moment class
 */
export class CharAtPipe implements PipeTransform {

  /**
   * Transform pipe
   *
   * @param value String date/time value
   * @param inputFormat Input format of date/time value
   */
  transform(value: any, count: number): any {

    return value.charAt(count);
  }


}
