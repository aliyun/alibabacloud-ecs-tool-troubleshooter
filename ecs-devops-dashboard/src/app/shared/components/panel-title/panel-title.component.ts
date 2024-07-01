import { Component, Input, TemplateRef, ViewChild, OnInit, OnChanges, SimpleChanges, Renderer2, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ops-panel-title',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel-title.component.html',
  styleUrls: ['./panel-title.component.less']
})
export class PanelTitleComponent implements OnInit, OnChanges {

  constructor(private renderer: Renderer2, private hostElement: ElementRef) {

  }

  @Input() title = ""
  @Input() fontSize = 14
  @Input() color = '#333333'
  @Input() icon!: "doubleDot" | "singleDot" | TemplateRef<unknown>;
  @Input() marginBottom = 0;
  @Input() rightContent?: string | TemplateRef<unknown>;
  @Input() iconDistance = 0;

  @ViewChild("singleDotTemplate", { static: true, read: TemplateRef }) singleDotTemplate!: TemplateRef<unknown>
  @ViewChild("doubleDotTemplate", { static: true, read: TemplateRef }) doubleDotTemplate!: TemplateRef<unknown>

  public iconTemplateRef?: TemplateRef<unknown>;
  public rightCustomTemplateRef?: TemplateRef<unknown>;
  public marginInlineStart = 0;

  ngOnInit(): void {
    this.initializeIconTemplate();
    this.initializeMarginBottom();
    this.initializeRightContent();
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (propName == 'icon' && !changes[propName].isFirstChange) {
        this.initializeIconTemplate();
      }
      if (propName == 'marginBottom' && !changes[propName].isFirstChange) {
        this.initializeMarginBottom();
      }
    }
  }

  initializeIconTemplate() {
    if (this.icon) {
      if (this.icon == 'doubleDot') {
        this.iconTemplateRef = this.doubleDotTemplate;
        this.marginInlineStart = 20;
        return;
      }
      if (this.icon == 'singleDot') {
        this.iconTemplateRef = this.singleDotTemplate;
        this.marginInlineStart = 20;
        return;
      }
      if (this.icon instanceof TemplateRef) {
        this.iconTemplateRef = this.icon;
        if (this.iconDistance > 0) {
          this.marginInlineStart = this.iconDistance;
        } else {
          this.marginInlineStart = 8;
        }
        return;
      }
      this.marginInlineStart = 0;
      this.iconTemplateRef = undefined;

    }
  }

  initializeMarginBottom() {
    if (this.hostElement.nativeElement && Number.isInteger(this.marginBottom)) {
      this.renderer.setStyle(this.hostElement.nativeElement, "marginBottom", `${this.marginBottom}px`)
    } else {
      this.renderer.setStyle(this.hostElement.nativeElement, "marginBottom", `0`)
    }
  }

  initializeRightContent() {
    if (this.rightContent) {
      if (this.rightContent instanceof TemplateRef) {
        this.rightCustomTemplateRef = this.rightContent;
      } else if (typeof this.rightContent != 'string') {
        this.rightCustomTemplateRef = undefined;
        this.rightContent = undefined
      }
    } else {
      this.rightCustomTemplateRef = undefined;
    }
  }
}
