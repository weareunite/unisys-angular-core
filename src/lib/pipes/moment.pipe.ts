import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})

/**
 * Moment Pipe is formatting time in string format by moment class
 */
export class MomentPipe implements PipeTransform {

  /**
   * Transform pipe
   *
   * @param value String date/time value
   * @param inputFormat Input format of date/time value
   * @param outputFormat Output format of date/time value
   */
  transform(value: any, inputFormat: string, outputFormat: string): any {

    return moment(value, inputFormat).format(outputFormat);
  }


}
