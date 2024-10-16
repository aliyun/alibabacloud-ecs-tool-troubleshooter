import {Component, DestroyRef, inject, Input, OnInit} from '@angular/core';
import {GlobalConstant} from "../../../constants/constants";
import {NzDrawerRef} from "ng-zorro-antd/drawer";
import {Store} from "@ngrx/store";
import {selectRegionInfo} from "../../../ngrx/selectors/global.select";
import {MetricSetEffectService} from "../service/metric-set-effect.service";
import {displayErrorMessage, displaySuccessMessage} from "../../../ngrx/actions/global.action";

@Component({
  selector: 'ops-modify-metric-set',
  templateUrl: './modify-metric-set.component.html',
  styleUrls: ['./modify-metric-set.component.less'],
  providers: [MetricSetEffectService]
})
export class ModifyMetricSetComponent implements OnInit {


  resourceTypes = GlobalConstant.DIAGNOSTIC_RESOURCE_TYPE;

  resourceType = "instance";

  metricSetDesc = "";

  metricSetName = "";

  metricSetId = "";

  regionId = "";

  metricIds: string[] = []

  btnLoading = false;

  btnText = "创建"

  metricIdData: any[] = []

  private nzDrawerRef = inject(NzDrawerRef)

  private store = inject(Store)

  private destroyRef = inject(DestroyRef)

  private metricSetEffectService = inject(MetricSetEffectService)

  allChecked = false;

  indeterminate = false;

  regionOptions: any = []

  operation = ""

  @Input()
  set value(data: any) {
    this.operation = data.operation
    if (this.operation == "modify") {
      this.btnText = "修改"
      this.metricSetName = data.MetricSetName
      this.metricSetId = data.MetricSetId
      this.metricSetDesc = data.Description
      this.metricIds = data.MetricIds
      this.resourceType = data.ResourceType
    }
    this.regionId = data.regionId

    this.transferMetricIdData(data.metricIdData)
  }

  ngOnInit(): void {
    const regionInfoSub = this.store.select(selectRegionInfo).subscribe(data => {
      const tmp: any[] = []
      for (let i = 0; i < data.length; i++) {
        tmp.push({
          label: data[i].LocalName,
          value: data[i].RegionId,
          checked: this.regionId === data[i].RegionId
        })
      }
      this.indeterminate = true
      this.regionOptions = tmp
    })
    this.destroyRef.onDestroy(() => {
      regionInfoSub.unsubscribe()
    })
  }

  transferMetricIdData(data: any) {
    const tmp = []
    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      tmp.push({
        key: item.MetricId,
        checked: false,
        ...item,
        direction: this.metricIds.includes(item.MetricId) ? 'right' : 'left'
      })
    }
    this.metricIdData = tmp
  }

  filterOption(val: string, item: any) {
    if (!val) {
      val = ""
    }
    return item.MetricId.toLowerCase().indexOf(val.toLowerCase()) > -1
  }

  close() {
    this.nzDrawerRef.close()
  }

  submit() {
    this.btnLoading = true
    const metricIds = this.metricIdData.filter(item => item.direction === 'right').map(item => item.MetricId)
    const regionIds = this.regionOptions.filter((item: any) => item.checked).map((item: any) => item.value)

    if (metricIds.length === 0) {
      this.store.dispatch(displayErrorMessage({
        content: "请选择诊断指标"
      }))
      this.btnLoading = false
      return
    }

    if (regionIds.length === 0) {
      this.store.dispatch(displayErrorMessage({
        content: "请选择地域"
      }))
      this.btnLoading = false
      return
    }

    if (this.operation == 'create') {
      this.metricSetEffectService.batchCreateMetricSet({
        MetricSetName: this.metricSetName,
        Description: this.metricSetDesc,
        ResourceType: this.resourceType,
        MetricIds: metricIds
      }, regionIds).subscribe(res => {
        this.btnLoading = false
        this.store.dispatch(displaySuccessMessage({
          content: "创建诊断指标集成功"
        }))

        this.nzDrawerRef.close({
          success: true,
          msg: "create success"
        })
      })
    } else if (this.operation == 'modify') {
      this.metricSetEffectService.modifyMetricSet({
        MetricSetId: this.metricSetId,
        MetricSetName: this.metricSetName,
        Description: this.metricSetDesc,
        ResourceType: this.resourceType,
        RegionId: this.regionId,
        MetricIds: metricIds
      }).subscribe(res => {
        this.btnLoading = false
        if (res == null) {
          this.store.dispatch(displayErrorMessage({
            content: "修改诊断指标集失败, 请稍后重试"
          }))
        } else {
          this.store.dispatch(displaySuccessMessage({
            content: "修改诊断指标集成功"
          }))
          this.nzDrawerRef.close({
            success: true,
            msg: "modify success"
          })
        }

      })
    }

  }


  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.regionOptions = this.regionOptions.map((item: any) => ({
        ...item,
        checked: true
      }));
    } else {
      this.regionOptions = this.regionOptions.map((item: any) => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(): void {
    if (this.regionOptions.every((item: any) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.regionOptions.every((item: any) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }


}
