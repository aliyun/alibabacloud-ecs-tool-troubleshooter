import {Component, inject, Input} from '@angular/core';
import {NzDrawerRef} from "ng-zorro-antd/drawer";
import {GlobalConstant} from "../../../constants/constants";
import {Store} from "@ngrx/store";
import {displayErrorMessage, displaySuccessMessage} from "../../../ngrx/actions/global.action";
import {OverviewService} from "../services/effects/overview.service";

@Component({
  selector: 'ops-instance-maintenance-attr',
  providers: [OverviewService],
  templateUrl: './instance-maintenance-attr.component.html',
  styleUrls: ['./instance-maintenance-attr.component.less']
})
export class InstanceMaintenanceAttrComponent {


  @Input()
  set value(val: any) {
    this.instanceIds = val.instanceIds;
    this.regionId = val.regionId;
    if (val.localDiskInstance) {
      this.radioOptions = GlobalConstant.INSTANCE_MAINTENANCE_ATTR_ACTION_OPTIONS
    } else {
      const options = [...GlobalConstant.INSTANCE_MAINTENANCE_ATTR_ACTION_OPTIONS]
      this.radioOptions = options.filter(item => item.value !== 'AutoRedeploy')
    }

    if (val.instanceIds.length > 1) {
      this.maintenanceAction = 'AutoRecover';
      // this.notifyOnMaintenance = true;
      this.startTime = "";
      this.endTime = "";
    } else {

      if (val.instanceMaintenanceAttr) {
        this.maintenanceAction = val.instanceMaintenanceAttr.ActionOnMaintenance ? val.instanceMaintenanceAttr.ActionOnMaintenance.Value : 'AutoRecover';
        // this.notifyOnMaintenance = val.instanceMaintenanceAttr.NotifyOnMaintenance === undefined ? true : val.instanceMaintenanceAttr.NotifyOnMaintenance;
        if (val.instanceMaintenanceAttr.MaintenanceWindows
          && val.instanceMaintenanceAttr.MaintenanceWindows.MaintenanceWindow
          && val.instanceMaintenanceAttr.MaintenanceWindows.MaintenanceWindow[0]) {
          this.startTime = val.instanceMaintenanceAttr.MaintenanceWindows.MaintenanceWindow[0].StartTime;
          this.endTime = val.instanceMaintenanceAttr.MaintenanceWindows.MaintenanceWindow[0].EndTime;
        } else {
          this.startTime = "";
          this.endTime = "";
        }
      }
    }

  }

  regionId = "";

  instanceIds = [];

  maintenanceAction = 'AutoRecover';

  notifyOnMaintenance = true;

  startTime = "";

  endTime = "";

  localDiskInstance = false;

  loading = false;

  private store = inject(Store)

  private overviewService = inject(OverviewService)

  constructor(private nzDrawerRef: NzDrawerRef) {
  }

  radioOptions = GlobalConstant.INSTANCE_MAINTENANCE_ATTR_ACTION_OPTIONS

  timeHourOptions = [
    {
      label: '00:00:00',
      value: '00:00:00'
    },
    {
      label: '01:00:00',
      value: '01:00:00'
    },
    {
      label: '02:00:00',
      value: '02:00:00'
    },
    {
      label: '03:00:00',
      value: '03:00:00'
    },
    {
      label: '04:00:00',
      value: '04:00:00'
    },
    {
      label: '05:00:00',
      value: '05:00:00'
    },
    {
      label: '06:00:00',
      value: '06:00:00'
    },
    {
      label: '07:00:00',
      value: '07:00:00'
    },
    {
      label: '08:00:00',
      value: '08:00:00'
    },
    {
      label: '09:00:00',
      value: '09:00:00'
    },
    {
      label: '10:00:00',
      value: '10:00:00'
    },
    {
      label: '11:00:00',
      value: '11:00:00'
    },
    {
      label: '12:00:00',
      value: '12:00:00'
    },
    {
      label: '13:00:00',
      value: '13:00:00'
    },
    {
      label: '14:00:00',
      value: '14:00:00'
    },
    {
      label: '15:00:00',
      value: '15:00:00'
    },
    {
      label: '16:00:00',
      value: '16:00:00'
    },
    {
      label: '17:00:00',
      value: '17:00:00'
    },
    {
      label: '18:00:00',
      value: '18:00:00'
    },
    {
      label: '19:00:00',
      value: '19:00:00'
    },
    {
      label: '20:00:00',
      value: '20:00:00'
    },
    {
      label: '21:00:00',
      value: '21:00:00'
    },
    {
      label: '22:00:00',
      value: '22:00:00'
    },
    {
      label: '23:00:00',
      value: '23:00:00'
    }
  ]


  submitForm() {
    if (this.startTime && !this.endTime) {
      this.store.dispatch(displayErrorMessage({
        content: '开始时间和结束时间必须同时存在'
      }))
      return;
    }

    if (!this.startTime && this.endTime) {
      // startTime 和 endTime 必须同时存在
      this.store.dispatch(displayErrorMessage({
        content: '开始时间和结束时间必须同时存在'
      }))
      return;
    }

    if (this.startTime && this.endTime && this.startTime == this.endTime) {
      this.store.dispatch(displayErrorMessage({
        content: '开始时间和结束时间不能相等'
      }))
      return;
    }

    // loading
    this.loading = true;
    this.overviewService.modifyInstanceMaintenanceAttr({
      RegionId: this.regionId,
      ActionOnMaintenance: this.maintenanceAction,
      // NotifyOnMaintenance: this.notifyOnMaintenance,
      InstanceId: this.instanceIds,
      MaintenanceWindow: [
        {
          StartTime: this.startTime,
          EndTime: this.endTime
        }
      ]
    }).subscribe(data => {
      this.loading = false;
      if (data == null){
        return;
      }

      this.store.dispatch(displaySuccessMessage({
        content: '修改成功'
      }))

      this.nzDrawerRef.close({
        success: true
      })
    })

  }


  close() {
    this.nzDrawerRef.close()
  }

}
