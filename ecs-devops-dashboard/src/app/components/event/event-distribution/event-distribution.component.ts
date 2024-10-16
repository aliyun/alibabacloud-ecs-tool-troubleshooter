import {Component, ElementRef, EventEmitter, inject, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {Store} from "@ngrx/store";
import {selectRegionInfo} from "../../../ngrx/selectors/global.select";

@Component({
  selector: 'ops-event-distribution',
  templateUrl: './event-distribution.component.html',
  styleUrls: ['./event-distribution.component.less']
})
export class EventDistributionComponent implements OnDestroy {

  private store = inject(Store)

  regionData: any[] = []

  loading = false

  eventDataMap: any = {}

  @ViewChild('mapEventContainer') elementRef!: ElementRef;

  @Output() itemClick = new EventEmitter<string>();

  @Input()
  set value(value: any) {
    this.loading = value.spinning
    const temp: any = {}
    for (let i = 0; i < value.dataList.length; i++) {
      if (!temp[value.dataList[i].RegionId]) {
        temp[value.dataList[i].RegionId] = []
      }
      temp[value.dataList[i].RegionId].push(value.dataList[i])
    }
    this.eventDataMap = temp
  }

  private regionSub = this.store.select(selectRegionInfo).subscribe(res => {
    this.regionData = res;
  })

  lastValue = 0

  getWidth() {
    if (this.elementRef && this.elementRef.nativeElement.clientWidth > 0) {
      this.lastValue = this.elementRef.nativeElement.clientWidth
    }
    return this.lastValue;
  }

  eventClick(regionId: string) {
    if (this.hasValue(regionId)) {
      document.body.click()
      this.itemClick.emit(regionId)
    }
  }

  getEventData(regionId: string) {
    const data = this.eventDataMap[regionId] || []
    const instanceSet = new Set()
    const eventTypeSet = new Set()
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      instanceSet.add(item.InstanceId)
      eventTypeSet.add(item.EventType.Name)
    }
    return {
      instanceCount: instanceSet.size,
      eventCount: data.length,
      eventTypeCount: eventTypeSet.size,
    }
  }

  hasValue(regionId: string) {
    const data = this.getEventData(regionId);
    return data.eventCount > 0
  }

  ngOnDestroy(): void {
    this.regionSub.unsubscribe()
  }
}
