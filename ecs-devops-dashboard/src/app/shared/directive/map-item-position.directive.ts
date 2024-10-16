import {Directive, ElementRef, Input, OnChanges, OnInit, Renderer2, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[opsMapItemPosition]',
  standalone: true
})
export class MapItemPositionDirective implements OnInit, OnChanges {

  constructor(private hostElement: ElementRef, private renderer: Renderer2) {
  }

  private flexRegion: any = [
    "cn-beijing",
    "cn-zhangjiakou",
    "cn-wulanchabu",
    "ap-southeast-7",
    "ap-southeast-3",
    "ap-southeast-1",
    "cn-shenzhen"
  ]

  private static REGION_MAP: any = {
    "cn-qingdao": [2181, 798],
    "cn-beijing": [2050, 663],
    "cn-zhangjiakou": [1952, 617],
    "cn-huhehaote": [1756, 616],
    "cn-wulanchabu": [1856, 584],
    "cn-hangzhou": [2150, 1050],
    "cn-shanghai": [2210, 999],
    "cn-hangzhou-acdr-ut-1": [2070, 1030], // 杭州专属云KS01
    "cn-nanjing": [2086, 938],
    "cn-heyuan": [2016, 1238],
    "cn-guangzhou": [1831, 1270],
    "cn-fuzhou": [2136, 1205],
    "cn-wuhan-lr": [1926, 999], // 华中1（武汉-本地地域）
    "cn-chengdu": [1509, 999],
    "cn-shenzhen": [1950, 1319],
    "cn-hongkong": [1906, 1346],

    "ap-northeast-1": [2483, 735],
    "ap-northeast-2": [2337, 716],

    "ap-southeast-1": [1367, 1590], // 新加坡
    "ap-southeast-2": [2112, 1620], // 澳大利亚
    "ap-southeast-3": [1316, 1524], // 马来西亚
    "ap-southeast-6": [1903, 1512], // 菲律宾
    "ap-southeast-5": [1747, 1590], // 印尼
    "ap-south-1": [676, 1333], // 印度
    "ap-southeast-7": [1364, 1460], // 泰国

    "us-east-1": [2649, 827],
    "us-west-1": [2579, 863],
    "eu-west-1": [104, 268],
    "me-east-1": [286, 834],
    "eu-central-1": [260, 391]
  }

  @Input() width = 0;
  @Input() height = 0;
  @Input() regionId = '';

  ngOnChanges(changes: SimpleChanges): void {
    let isChange = false;
    for (const propName in changes) {
      if (!changes[propName].firstChange) {
        if (propName == 'width') {
          this.width = changes[propName].currentValue;
          isChange = true;
        }
      }
    }
    //宽、高、比例改变时，改变坐标
    if (isChange) {
      this.layout()
      const [left, top] = this.calcPosition();
      this.setPosition(left, top);
    }
  }

  ngOnInit(): void {
    this.renderer.setStyle(this.hostElement.nativeElement, "position", "absolute");
    this.renderer.setStyle(this.hostElement.nativeElement, "width", "max-content");
    this.layout()
    const [left, top] = this.calcPosition();
    this.setPosition(left, top);
  }

  layout() {
    let fontSize = 10;
    if (this.width > 1440) {
      fontSize = 12;
    }
    this.renderer.setStyle(this.hostElement.nativeElement, "font-size", `${fontSize}px`);
    if (this.flexRegion.includes(this.regionId)) {
      this.renderer.setStyle(this.hostElement.nativeElement, "display", "flex");
      this.renderer.setStyle(this.hostElement.nativeElement, "align-items", "center");
    }
  }

  setPosition(left: number, top: number): void {
    if (!MapItemPositionDirective.REGION_MAP[this.regionId]) {
      this.renderer.setStyle(this.hostElement.nativeElement, "display", `none`);
      return;
    }

    this.renderer.setStyle(this.hostElement.nativeElement, "left", `${left}px`);
    this.renderer.setStyle(this.hostElement.nativeElement, "top", `${top}px`)
  }

  //计算对应比例下的坐标
  calcPosition(): any {
    const imgWidth = 2814;
    const rate = this.width / imgWidth;
    return this.getInit(rate);
  }

  private getInit(re: number): any {
    const position = MapItemPositionDirective.REGION_MAP[this.regionId] || [0, 0]
    return [position[0] * re, position[1] * re]
  }

}
