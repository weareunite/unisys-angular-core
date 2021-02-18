import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteSeconds'
})
export class MinuteSecondsPipe implements PipeTransform{

  transform(value: number): string {
    value = +value;

    const h = Math.floor(value / 3600);
    const m = Math.floor(value % 3600 / 60);
    const s = Math.floor(value % 3600 % 60);

    return this.zeroFill(h, 2) + ':' + this.zeroFill(m, 2) + ':' + this.zeroFill(s, 2) ;
  }

  zeroFill(num, width) {
    return String((new Array(width + 1)).join('0') + num).slice(-width);
  }

}
