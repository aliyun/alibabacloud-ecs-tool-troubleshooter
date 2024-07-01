import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {FormsModule} from '@angular/forms';
import {NzResultModule} from 'ng-zorro-antd/result';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'ops-empty-page',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzBadgeModule, FormsModule, NzResultModule, NzButtonModule, RouterModule],
  templateUrl: './empty-page.component.html',
  styleUrls: ['./empty-page.component.less']
})
export class EmptyPageComponent {

  public title = '页面不存在';

}
