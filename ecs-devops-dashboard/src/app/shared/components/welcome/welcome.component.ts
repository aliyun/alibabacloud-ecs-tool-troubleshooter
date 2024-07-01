import {Component, ElementRef, ViewChild} from '@angular/core';
import {displayWarningMessage} from 'src/app/ngrx/actions/global.action';
import {SearchBlockComponent} from '../search-block/search-block.component';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {BehaviorSubject} from 'rxjs';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {OverlayModule} from '@angular/cdk/overlay'
import {NzIconModule} from 'ng-zorro-antd/icon';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SystemUtil} from 'src/app/utils/utils';
import {Store} from '@ngrx/store';

@Component({
  selector: 'ops-welcome',
  standalone: true,
  imports: [CommonModule, NzIconModule, NzBadgeModule, NzDropDownModule, FormsModule, SearchBlockComponent, OverlayModule, NzInputModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent {

  constructor(private store: Store) {
  }

  @ViewChild("wrapSearchInput", {read: ElementRef, static: true}) wrapSearchInput!: ElementRef;
  @ViewChild(SearchBlockComponent, {read: ElementRef, static: false}) searchBlock?: ElementRef;

  private subject = new BehaviorSubject<string>("");
  public searchValue: string | null = null;
  public searchInputObservable = this.subject.asObservable();

  searchEvent() {
    if (this.searchValue && this.searchValue.trim()) {
      const searchValue: string = this.searchValue.trim();
      if (SystemUtil.isVm(searchValue)) {
        this.store.dispatch(displayWarningMessage({content: "请单击您要前往的页面"}));
      } else {
        this.store.dispatch(displayWarningMessage({content: "无效的输入，请重新输入后再试"}));
      }
    } else {
      this.store.dispatch(displayWarningMessage({content: "无效的输入，请重新输入后再试"}));
    }
  }

  searchValueChange(value: string) {
    this.subject.next(value);
  }

}
