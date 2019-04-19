import { Component, OnInit } from '@angular/core';
import { SigninService } from '../../services/signin.service';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {

  isLoggedIn: boolean = false;
  constructor(
		private loginService: SigninService,
		private router: Router,
  ) { }

  async ngOnInit() {
    this.isLoggedIn = await this.loginService.checkLogin();
    console.log(await this.isLoggedIn);
  }

  logOut() {
    this.loginService.logOut()
      .then(() => {
        this.router.navigate['/signin'];
      })
      .catch((err) => {
        this.router.navigate['/signin'];
        console.error(err); 
      });
  }
}
