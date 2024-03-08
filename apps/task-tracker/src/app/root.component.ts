import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  imports: [RouterModule],
  standalone: true,
  selector: 'tt-root',
  template: `<router-outlet /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootComponent {}
