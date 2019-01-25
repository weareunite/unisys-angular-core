import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {UserService} from '../../services/user.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-quick-login',
  templateUrl: './quick-login.component.html',
  styleUrls: ['./quick-login.component.css']
})
export class QuickLoginComponent implements OnInit, OnDestroy {
    constructor(
        private user: UserService,
        private renderer: Renderer2,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.renderer.addClass(document.body, 'fullscreen');
        if (this.auth.getAccessToken()) {
            this.router.navigate(['']);
        }
        this.user.getOneTimeToken();
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'fullscreen');
    }

    onSignIn(form: NgForm) {
        const code = form.value.code;
        this.user.quickSinginUser(code);
    }

}
