import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrls: ['./singin.component.css']
})
export class SinginComponent implements OnInit, OnDestroy {
    constructor(
        private user: UserService,
        private renderer: Renderer2,
        private auth: AuthService,
        private router: Router
    ) {
        if (this.auth.getAccessToken()) {
            this.router.navigate(['']);
        }
    }

    ngOnInit() {
        this.renderer.addClass(document.body, 'fullscreen');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'fullscreen');
    }

    onSignIn(form: NgForm) {
        const username = form.value.username;
        const password = form.value.password;

        this.user.singinUser(username, password);
    }

}
