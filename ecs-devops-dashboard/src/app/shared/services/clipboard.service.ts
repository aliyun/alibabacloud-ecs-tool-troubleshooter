import { Inject, Injectable, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { Store } from '@ngrx/store';
import { displaySuccessMessage } from 'src/app/ngrx/actions/global.action';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService implements OnDestroy {

  constructor(@Inject(DOCUMENT) private document: Document, private store: Store) {

  }

  private textArea!: HTMLTextAreaElement;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public copy(content: string, notice = false) {
    if (!content) {
      return;
    }
    this.copyContent(content)
    this.store.dispatch(displaySuccessMessage({ content: "已复制" }))
  }

  private copyContent(content: string) {
    if (!this.textArea) {
      this.textArea = this.createTextArea();
      this.document.body.appendChild(this.textArea);
    }
    this.textArea.value = content;
    this.textArea.select();
    this.textArea.setSelectionRange(0, this.textArea.value.length)

    this.document.execCommand("copy");

    this.textArea.focus();
    window.getSelection()?.removeAllRanges();
  }

  private createTextArea() {
    const isRTL = this.document.documentElement.getAttribute('dir') === 'rtl';
    const textArea = this.document.createElement('textarea') as unknown as HTMLTextAreaElement;
    textArea.style.fontSize = '12pt';
    textArea.style.border = '0';
    textArea.style.padding = '0';
    textArea.style.margin = '0';
    textArea.style.position = 'absolute';
    textArea.style[isRTL ? 'right' : 'left'] = '-9999px';
    textArea.style.top = `${this.document.documentElement.scrollTop}px`;
    textArea.setAttribute('readonly', '');
    return textArea;
  }


  ngOnDestroy(): void {
    const body = this.document.body;
    if (this.textArea) {
      body.removeChild(this.textArea);
    }
  }
}
