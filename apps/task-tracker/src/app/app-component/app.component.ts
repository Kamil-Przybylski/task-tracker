import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthAccessService } from '@libs/core-web';
import { IUiSideNavItem, UiSideNavComponent } from '@libs/shared-web';

@Component({
  imports: [RouterOutlet, RouterLink, UiSideNavComponent],
  selector: 'app-component',
  standalone: true,
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AppComponent {
  navItems: IUiSideNavItem[] = [
    { name: 'home', icon: 'home', link: 'home' },
    { name: 'dashboard', icon: 'dashboard', link: 'dashboard' },
  ];

  authService = inject(AuthAccessService);
}
