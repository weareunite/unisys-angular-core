import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterColumns',
    pure: false,
})

export class FilterColumnsPipe implements PipeTransform {
    transform(items: any[], fields: string[]): any {
        return items.filter(item => fields.indexOf(item.key) > -1);
    }
}