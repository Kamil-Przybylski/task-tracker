import { BreakpointObserver } from '@angular/cdk/layout';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUiSideNavItem } from './ui-layout.models';

@Component({
  selector: 'ui-layout',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,

    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './ui-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiLayoutComponent {
  #screenSize$: Observable<boolean> = inject(BreakpointObserver)
    .observe(['(max-width: 800px)'])
    .pipe(map((screenSize) => screenSize.matches));
  isMobile = toSignal(this.#screenSize$, { requireSync: true });

  sidenav = viewChild.required(MatSidenav);
  items = input.required<IUiSideNavItem[]>();
  isCollapsed = signal(false);

  logout = output();

  toggleMenu() {
    if (this.isMobile()) {
      this.sidenav().toggle();
      this.isCollapsed.set(false);
    } else {
      this.sidenav().open();
      this.isCollapsed.update((isCollapsed) => !isCollapsed);
    }
  }
}
