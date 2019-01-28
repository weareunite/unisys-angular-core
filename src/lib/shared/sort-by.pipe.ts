
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'sortBy'
})
export class SortByPipe implements PipeTransform {
    transform(array: any[], field: string): any[] {
        let desc = false;
        if(field.includes("-")){
            field = field.replace("-","");
            desc = true
        }
        if (array !== undefined) {
            array.sort((a: any, b: any) => {
                if(!isNaN(a[field])){
                    a[field] = parseFloat(a[field])
                }
                if(!isNaN(b[field])){
                    b[field] = parseFloat(b[field])
                }
                if (a[field] < b[field]) {
                    return -1;
                } else if (a[field] > b[field]) {
                    return 1;
                } else {
                    return 0;
                }
            });
            if(desc){
                array.reverse();
            }
        }
        return array;
    }
}
