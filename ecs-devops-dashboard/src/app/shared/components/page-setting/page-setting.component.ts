import {Component, inject, OnDestroy} from '@angular/core';
import {selectAccessKeyInfo, selectAllRegionInfo, selectFocusRegionInfo} from "../../../ngrx/selectors/global.select";
import {Store} from "@ngrx/store";
import {NzModalRef} from "ng-zorro-antd/modal";
import {
  changeAccessKeyAction,
  displayWarningMessage,
  saveSelectedRegionAction
} from "../../../ngrx/actions/global.action";

@Component({
  selector: 'ops-page-setting',
  templateUrl: './page-setting.component.html',
  styleUrls: ['./page-setting.component.less']
})
export class PageSettingComponent implements OnDestroy {

  ak = ""
  sk = ""

  selectedIndex = 0

  private store = inject(Store)

  private nzModalRef = inject(NzModalRef)

  private akSub = this.store.select(selectAccessKeyInfo).subscribe(data => {
    this.ak = data.accessKeyId
    this.sk = data.accessKeySecret
  })

  sourceRegionInfo: any[] = []

  sourceRegionData: any[] = []

  selectedRegionData: any[] = []

  private regionSub = this.store.select(selectAllRegionInfo).subscribe(data => {
    this.sourceRegionData = data
    this.handlerRegionInfo()
  })

  private selectedRegionSub = this.store.select(selectFocusRegionInfo).subscribe(data => {
    this.selectedRegionData = data
    this.handlerRegionInfo()
  })

  handlerRegionInfo() {
    const data = this.sourceRegionData
    if (data) {
      const temp: any[] = []
      const asiaPacificCn = []
      const asiaPacificOther = []
      const europeAmerica = []
      const middleEast = []
      const other = []
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const val: any = {
          label: item.LocalName,
          value: item,
          checked: this.selectedRegionData.length === 0 || this.selectedRegionData.includes(item.RegionId)
        }
        if (item.RegionId.startsWith("cn-")) {
          // 亚太中国
          asiaPacificCn.push(val)
        } else if (item.RegionId.startsWith("ap")) {
          // 亚太其他
          asiaPacificOther.push(val)
        } else if (item.RegionId.startsWith("eu") || item.RegionId.startsWith("us") || item.RegionId.startsWith("rus")) {
          // 欧美
          europeAmerica.push(val)
        } else if (item.RegionId.startsWith("me")) {
          // 中东
          middleEast.push(val)
        } else {
          // 其他
          other.push(val)
        }
      }

      temp.push({
        label: "亚太-中国",
        checked: asiaPacificCn.every((item: any) => item.checked),
        indeterminate: !asiaPacificCn.every((item: any) => item.checked) && !asiaPacificCn.every((item: any) => !item.checked),
        children: asiaPacificCn
      })
      temp.push({
        label: "亚太-其他",
        checked: asiaPacificOther.every((item: any) => item.checked),
        indeterminate: !asiaPacificOther.every((item: any) => item.checked) && !asiaPacificOther.every((item: any) => !item.checked),
        children: asiaPacificOther
      })
      temp.push({
        label: "欧洲-美洲",
        checked: europeAmerica.every((item: any) => item.checked),
        indeterminate: !europeAmerica.every((item: any) => item.checked) && !europeAmerica.every((item: any) => !item.checked),
        children: europeAmerica
      })
      temp.push({
        label: "中东",
        checked: middleEast.every((item: any) => item.checked),
        indeterminate: !middleEast.every((item: any) => item.checked) && !middleEast.every((item: any) => !item.checked),
        children: middleEast
      })
      temp.push({
        label: "其他",
        checked: other.every((item: any) => item.checked),
        indeterminate: !other.every((item: any) => item.checked) && !other.every((item: any) => !item.checked),
        children: other
      })

      this.sourceRegionInfo = temp
    }
  }

  updateAllChecked(data: any, event: any) {
    data.checked = event
    data.indeterminate = false;
    if (data.checked) {
      data.children = data.children.map((item: any) => ({
        ...item,
        checked: true
      }));
    } else {
      data.children = data.children.map((item: any) => ({
        ...item,
        checked: false
      }));
    }
  }

  updateSingleChecked(data: any): void {
    if (data.children.every((item: any) => !item.checked)) {
      data.checked = false;
      data.indeterminate = false;
    } else if (data.children.every((item: any) => item.checked)) {
      data.checked = true;
      data.indeterminate = false;
    } else {
      data.indeterminate = true;
    }
  }

  save() {
    if (this.akSave() && this.regionSave()) {
      this.nzModalRef.close()
      window.location.reload()
    }
  }

  cancel() {
    this.nzModalRef.close()
  }

  akSave() {
    // 校验 ak sk 是否都存在
    if (!this.ak && this.sk) {
      // 提示 ak 不能为空
      this.store.dispatch(displayWarningMessage({content: "accessKeyId 不能为空"}))
      return false
    }
    if (!this.sk && this.ak) {
      // 提示 sk 不能为空
      this.store.dispatch(displayWarningMessage({content: "accessKeySecret 不能为空"}))
      return false
    }
    this.store.dispatch(changeAccessKeyAction({accessKeyId: this.ak, accessKeySecret: this.sk}))
    return true
  }

  regionSave() {
    const temp = []
    for (let i = 0; i < this.sourceRegionInfo.length; i++) {
      const group = this.sourceRegionInfo[i]
      for (let j = 0; j < group.children.length; j++) {
        const region = group.children[j]
        if (region.checked) {
          temp.push(region.value.RegionId)
        }
      }
    }
    if (temp.length === 0) {
      this.store.dispatch(displayWarningMessage({content: "请至少选择一个地域"}))
      return false
    }
    this.store.dispatch(saveSelectedRegionAction({selectedRegion: temp}))
    return true
  }

  ngOnDestroy(): void {
    this.akSub.unsubscribe()
    this.regionSub.unsubscribe()
    this.selectedRegionSub.unsubscribe()
  }

}
