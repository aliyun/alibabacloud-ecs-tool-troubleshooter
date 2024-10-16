import {Component, inject, OnInit} from '@angular/core';
import {NZ_MODAL_DATA} from "ng-zorro-antd/modal";
import {SignUtils} from "../../../utils/sign.utils";
import "ansi-to-html"
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {OverviewService} from "../services/effects/overview.service";

const Convert = require("ansi-to-html");

@Component({
  selector: 'ops-instance-console-output',
  templateUrl: './instance-console-output.component.html',
  styleUrls: ['./instance-console-output.component.less'],
  providers: [OverviewService]
})
export class InstanceConsoleOutputComponent implements OnInit {


  readonly nzModalData: any = inject(NZ_MODAL_DATA);

  private overviewService = inject(OverviewService)

  loading = true

  output: SafeHtml = ""

  private convert = new Convert()

  constructor(private domSanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.init()
  }

  init() {
    this.overviewService.getInstanceConsoleOutput({
      InstanceId: this.nzModalData.InstanceId,
      RegionId: this.nzModalData.RegionId
    }).subscribe((data: any) => {
      this.loading = false
      if (data && data.ConsoleOutput) {
        //base64 decode
        const output = SignUtils.base64Decode(data.ConsoleOutput)
        try {
          this.output = this.domSanitizer.bypassSecurityTrustHtml(this.convert.toHtml(output).replaceAll("\n", "<br/>"))
        } catch (err) {
          console.log(err)
          this.output = output
        }
      } else {
        // get error
        this.output = "获取系统命令行输出信息失败，请稍后重试!"
      }

    })
  }

}
