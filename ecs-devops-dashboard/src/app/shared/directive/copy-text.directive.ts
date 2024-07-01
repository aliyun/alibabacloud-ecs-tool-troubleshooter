import { Directive, Input, inject, OnInit, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { ClipboardService } from '../services/clipboard.service';

@Directive({
  selector: '[opsCopyText]',
  standalone: true,
})
export class CopyTextDirective implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, private hostElement: ElementRef<HTMLElement>) { }

  private fillColor = '#d9d9d9';
  private lightFillColor = '#1890ff';
  private downLightFillColor = '#096dd9';
  private eventCallBackList: Array<() => void> = []

  @Input() copyWay: 'inner' | 'input' = 'inner';
  @Input() opsCopyText?: string;

  ngOnInit(): void {
    new Promise(() => {
      this.setCopyElement(this.createCopyElement())
    });
  }
  private clipboardService: ClipboardService = inject(ClipboardService);

  private setCopyElement(span: Node) {
    const parent = this.renderer.parentNode(this.hostElement.nativeElement);
    this.renderer.appendChild(parent, span)
    const svg = span.firstChild;
    if (svg) {
      this.eventCallBackList.push(this.renderer.listen(span, "mouseover", () => {
        this.renderer.setStyle(svg, "fill", this.lightFillColor)
        this.renderer.setStyle(svg, "cursor", "pointer")
      }))
      this.eventCallBackList.push(this.renderer.listen(span, "mouseout", () => {
        this.renderer.setStyle(svg, "fill", this.fillColor)
        this.renderer.setStyle(svg, "cursor", "none")
      }))
      this.eventCallBackList.push(this.renderer.listen(span, "mousedown", () => {
        this.renderer.setStyle(svg, "fill", this.downLightFillColor)
      }))
      this.eventCallBackList.push(this.renderer.listen(span, "mouseup", () => {
        this.renderer.setStyle(svg, "fill", this.lightFillColor)
      }))
      this.eventCallBackList.push(this.renderer.listen(span, "click", () => {
        if (this.copyWay == 'inner') {
          const content = this.hostElement.nativeElement.innerText;
          this.clipboardService.copy(content, true);
        }
        if (this.copyWay == 'input') {
          const content = this.opsCopyText || "";
          this.clipboardService.copy(content, true);
        }
      }))
    }
  }


  private createCopyElement() {
    const innerHTML = this.getIcon();
    const span = document.createElement("span");
    span.innerHTML = innerHTML;
    const svg = span.querySelector("svg");
    if (svg) {
      svg.style.width = '16px';
      svg.style.fill = this.fillColor;
      svg.style.position = 'absolute'
      svg.style.top = '-11px'
      svg.style.left = '2px'

      span.style.display = 'inline-block'
      span.style.verticalAlign = 'middle'
      span.style.position = 'relative'
      svg.style.width = '16px';
      svg.style.height = '16px';

    }
    return span.cloneNode(true);
  }

  getIcon() {
    return `<svg t="1646138147968" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2705" width="32" height="32"><path d="M768 682.666667V170.666667a85.333333 85.333333 0 0 0-85.333333-85.333334H170.666667a85.333333 85.333333 0 0 0-85.333334 85.333334v512a85.333333 85.333333 0 0 0 85.333334 85.333333h512a85.333333 85.333333 0 0 0 85.333333-85.333333zM170.666667 170.666667h512v512H170.666667z m682.666666 85.333333v512a85.333333 85.333333 0 0 1-85.333333 85.333333H256a85.333333 85.333333 0 0 0 85.333333 85.333334h426.666667a170.666667 170.666667 0 0 0 170.666667-170.666667V341.333333a85.333333 85.333333 0 0 0-85.333334-85.333333z" p-id="2706"></path></svg>`;

  }

  ngOnDestroy(): void {
    this.eventCallBackList.forEach(callback => {
      callback && callback();
    })
  }

}
