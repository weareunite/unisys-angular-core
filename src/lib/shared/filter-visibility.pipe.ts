import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterVisibility'
})

export class FilterVisibilityPipe implements PipeTransform {
    transform(items: any[], visibility: boolean): any {
        return items.filter(item => item.visibility == visibility);
    }
}