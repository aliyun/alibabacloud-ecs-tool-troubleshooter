import {Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA} from "ng-zorro-antd/modal";
import {OverviewService} from "../services/effects/overview.service";

@Component({
  selector: 'ops-instance-screen-snapshot',
  templateUrl: './instance-screen-snapshot.component.html',
  styleUrls: ['./instance-screen-snapshot.component.less'],
  providers: [OverviewService]
})
export class InstanceScreenSnapshotComponent implements OnInit {

  imgPrefix = "data:image/png;base64,";

  img = "";

  readonly nzModalData: any = inject(NZ_MODAL_DATA);

  private overviewService = inject(OverviewService)

  loading = true

  showImage = false

  showError = false

  ngOnInit() {
    this.init()
  }

  init() {
    this.overviewService.getInstanceScreenSnapshot({
      InstanceId: this.nzModalData.InstanceId,
      RegionId: this.nzModalData.RegionId,
      WakeUp: true
    }).subscribe((res: any) => {
      this.showImage = true
      this.loading = false
      if (res && res.Screenshot) {
        this.img = this.imgPrefix + res.Screenshot
      } else {
        // error
        this.showError = true
      }
    })
  }

}
