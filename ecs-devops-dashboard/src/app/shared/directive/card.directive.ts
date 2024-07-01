import { Directive, ElementRef, HostBinding, Input, OnChanges, Renderer2, SimpleChanges, OnInit } from '@angular/core';

@Directive({
  selector: '[opsCard]',
  standalone: true,
})
export class CardDirective implements OnInit, OnChanges {

  constructor(private hostElement: ElementRef, private renderer: Renderer2) { }

  @Input() dynamicShadow = false;
  @HostBinding("style.borderRadius.px") borderRadius = 4
  @HostBinding("style.backgroundColor") background = "white"
  // @HostBinding("style.boxShadow") boxShadow = "rgb(198 198 198 / 35%) 0px 0px 3px";
  @HostBinding("style.padding.px") padding = 24;
  @HostBinding("style.marginBlockEnd.px") @Input() blockEnd = 0;
  @HostBinding("style.border") border = '1px solid #ededed'

  private eventCallBackList: Array<() => void> = []

  ngOnInit(): void {
    this.initializeShadow(this.dynamicShadow)
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName == 'enableShadow' && !changes[propName].firstChange) {
        this.initializeShadow(changes[propName].currentValue)
      }
    }
  }

  initializeShadow(enable: boolean) {
    while (this.eventCallBackList.length) {
      const array = this.eventCallBackList.splice(0, 1);
      if (array.length && array[1]) {
        array[0]();
      }
    }

    if (enable) {
      this.eventCallBackList.push(this.renderer.listen(this.hostElement.nativeElement, "mouseover", () => {
        // this.boxShadow = "#c6c6c6b5 0px 0px 7px"
      }))

      this.eventCallBackList.push(this.renderer.listen(this.hostElement.nativeElement, "mouseleave", () => {
        // this.boxShadow = "rgb(198 198 198 / 35%) 0px 0px 3px"
      }))
    }
  }

}
