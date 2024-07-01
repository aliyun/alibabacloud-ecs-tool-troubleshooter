import { Directive, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { ECharts, EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { emptyLineChartOptions } from '../constants/echarts.constants';
import { Observable, Subject, Subscription, combineLatest } from 'rxjs';

@Directive({
  selector: '[opsEmptyEcharts]',
  standalone: true,
})
export class EmptyEchartsDirective implements OnInit, OnDestroy {

  constructor(@Optional() private ngxEchartsDirective: NgxEchartsDirective) { }

  @Input("opsEmptyEcharts") type?: "line";
  @Input() title?: string;

  private subscription = new Subscription();
  private subject = new Subject<boolean>();

  ngOnInit(): void {
    if (this.ngxEchartsDirective && this.type) {
      this.subscription.add(this.ngxEchartsDirective['changeFilter'].notFirstAndEmpty('merge', (options: EChartsOption) => {
        let isEmpty = false
        if (this.type == "line" && options.series) {
          if (Array.isArray(options.series)) {
            isEmpty = options.series.length == 0;
          } else if (Object.prototype.hasOwnProperty.call(options.series, "data")) {
            if (Array.isArray(options.series['data'])) {
              isEmpty = options.series['data'].length == 0;
            }
          }
        }
        this.subject.next(isEmpty);
      }));
      this.subscription.add(combineLatest([this.ngxEchartsDirective['chart$'] as Observable<ECharts>, this.subject]).subscribe(([echartsInstance, isEmpty]) => {
        this.initializeEmptyLineChart(echartsInstance, isEmpty);
      }))
      if (this.title) {
        const echartsInstance = this.ngxEchartsDirective['chart'] as ECharts;
        if (echartsInstance) {
          echartsInstance.setOption({
            title: {
              text: `{a|}  ${this.title}`
            }
          });
        }
      }
    }

  }

  private initializeEmptyLineChart(echartsInstance: ECharts, isEmpty: boolean) {
    if (isEmpty) {
      echartsInstance.setOption(emptyLineChartOptions, { replaceMerge: ['series', 'yAxis'] });
      if (this.title) {
        echartsInstance.setOption({
          title: {
            text: `{a|}  ${this.title}`
          }
        });
      }
    } else {
      setTimeout(() => {
        echartsInstance.setOption({
          yAxis: [
            {
              type: 'value',
              min: null,
              max: null,
              axisLabel: {
                show: true,
                formatter: function (value: number) {
                  return `${value}`
                }
              },
              splitLine: {
                show: true,
              },
            }
          ]
        }, { replaceMerge: ['yAxis'] });
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subject.complete();
  }


}
