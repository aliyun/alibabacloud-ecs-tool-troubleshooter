import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

declare const window: any

@Component({
    selector: 'ops-diagnosis-report',
    templateUrl: './diagnosis-report.component.html',
    styleUrls: ['./diagnosis-report.component.less']
})
export class DiagnosisReportComponent implements AfterViewInit {

    private readonly ecsDiagnoseReportComponentName = 'InstanceDiagnosticReport'
    private readonly ecsDiagnoseReportComponentId = "DiagnoseComponent_id_" + new Date().getTime() + Math.random() * 10

    @ViewChild("diagnoseReport") reportDom!: ElementRef;

    public loadingReport = true

    public previewInfo: any = {
        resourceId: null,
        resourceType: null,
        reportId: null,
        cycleTime: null,
        diagnosisTime: null
    }

    private currentReportData: any = null

    private entry: any = null

    constructor() {
        // 获取诊断 entry 并挂载
        this.entry = window.__ATOM_APP_STORE__['aliyun-ecs/ecs-core']
        this.entry.mount(true)
    }

    @Input()
    set report(report: {
        previewInfo: any, data: any
    }) {
        this.previewInfo = report.previewInfo
        this.currentReportData = report.data
    }

    ngAfterViewInit(): void {
        this.renderComponent(this.currentReportData)
    }

    /**
     * 渲染模版
     * @param report
     */
    renderComponent(report: any = {}) {
        // 获取dom
        const nativeElement = this.reportDom?.nativeElement;

        if (nativeElement == null) {
            console.error("current nativeElement is null")
            return;
        }
        const props = {
            className: 'diagnose-report',
            showCategory: true,
            regionId: "",
            report: report
        }
        const request = {
            id: this.ecsDiagnoseReportComponentId,
            // 组件name。参考组件文档
            name: this.ecsDiagnoseReportComponentName,
            // 组件props。参考组件文档
            props: props,
            // 组件挂载点，传入真实dom
            portal: nativeElement
        }
        // 渲染诊断报告
        new Promise((resolve) => {
            resolve(this.entry.service.request(request))
        }).then(() => {
            if (Object.keys(report).length > 0) {
                // 渲染 以后在关闭 loading
                this.loadingReport = false
            }
        })


    }

}
