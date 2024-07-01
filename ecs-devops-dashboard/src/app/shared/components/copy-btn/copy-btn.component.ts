import {Component, Input, Renderer2} from '@angular/core';
import {NzMessageService} from "ng-zorro-antd/message";
import {CommonModule} from "@angular/common";
import {NzIconModule} from "ng-zorro-antd/icon";

@Component({
  selector: 'ops-copy-button',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './copy-btn.component.html',
  styleUrls: ['./copy-btn.component.less']
})
export class CopyBtnComponent {

  @Input() text = "";

  constructor(
    private notification: NzMessageService,
    private _render: Renderer2
  ) { }
 
  copy(): void {
    if(this.text){
      const textArea: HTMLTextAreaElement = this._render.createElement("textarea");
      textArea.style.position = 'fixed';
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.background = 'transparent';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.innerHTML = this.text.toString();
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');

      if (successful) {
        this.notification.success('已复制到剪贴板', {nzDuration: 2000});
      }
      document.body.removeChild(textArea);
      this._render.destroy();
    } else {
      this.notification.error('获取复制的内容失败');
    }
  }

}
