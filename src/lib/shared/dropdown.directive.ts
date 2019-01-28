import {Directive, HostBinding, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[appDropdown]'
})

export class DropdownDirective {

    @Input('autoclose') autoclose:boolean = true;

    @HostBinding('class.open') isOpen = false;

    @HostListener('click', ['$event']) toggleOpen($event) {
        let parentClass = $event.target.parentNode.className;
        let parentParentClass =$event.target.parentNode.parentNode.className;
        if(this.autoclose){
            this.isOpen = !this.isOpen;
        }else{
            if(!this.isOpen){
                this.isOpen = !this.isOpen;
            }else{
                if(parentClass.includes('open') || parentParentClass.includes('open')){
                    this.isOpen = !this.isOpen;
                }
            }
        }
    }
}
