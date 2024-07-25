import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-ui-select-workspace',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ui-select-workspace.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiSelectWorkspaceComponent {}
