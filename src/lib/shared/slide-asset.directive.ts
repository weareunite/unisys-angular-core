import {Directive, HostListener, Renderer2} from '@angular/core';

@Directive({
    selector: '[appSlideAsset]'
})
export class SlideAssetDirective {

    constructor(private renderer: Renderer2) {}

    @HostListener('click') click() {
        const body = document.getElementsByTagName('body')[0];
        if (body.classList.contains('sidebar-collapse')) {
            this.renderer.removeClass(document.body, 'sidebar-collapse');
        } else {
            this.renderer.addClass(document.body, 'sidebar-collapse');
        }

    }
}
