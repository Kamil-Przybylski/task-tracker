import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  selector: 'app-component',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AppComponent {
  http = inject(HttpClient);

  test() {
    this.http.get('http://localhost:3900/api').subscribe(console.log);
  }
  logout() {
    this.http
      .get('http://localhost:3900/api/auth/logout/1')
      .subscribe(console.log);
    // location.reload();
  }
}
