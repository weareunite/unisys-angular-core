import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'isnan'
})

/**
 * Moment Pipe is formatting time in string format by moment class
 */
export class IsNaNPipe implements PipeTransform {

  /**
   * Transform pipe
   *
   * @param value String date/time value
   */
  transform(value: any): any {

    return (isNaN(value)) ? '' : value;
  }


}
