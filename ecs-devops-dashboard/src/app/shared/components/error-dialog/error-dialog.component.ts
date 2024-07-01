import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, Input, TemplateRef, ViewChild,} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CopyTextDirective} from '../../directive/copy-text.directive';
import {NzPopoverModule} from 'ng-zorro-antd/popover';

@Component({
  selector: 'ops-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.less'],
  standalone: true,
  imports: [CommonModule, FormsModule, CopyTextDirective, NzPopoverModule]
})
export class ErrorDialogComponent {

  @ViewChild("httpErrorResponseTemplate", {
    read: TemplateRef,
    static: true
  }) httpErrorResponseTemplate?: TemplateRef<unknown>;

  @ViewChild("httpApiErrorResponseTemplate", {
    read: TemplateRef,
    static: true
  }) httpApiErrorResponseTemplate?: TemplateRef<unknown>;

  public displayTemplate!: TemplateRef<unknown>;
  public contextExp: { [key: string]: unknown } = {};

  @Input()
  set errorData(error: HttpErrorResponse | Error | unknown) {
    if (error instanceof HttpErrorResponse) {
      if (this.isSdkError(error)) {
        this.initializeHttpApiErrorResponse(error.error)
        return
      }
      this.initializeHttpErrorResponse(error);
      return
    }
  }

  isUnknownError(error: HttpErrorResponse) {
    return error.statusText == "Unknown Error"
  }

  isSdkError(error: HttpErrorResponse) {
    return !!(error.error && Object.keys(error.error).length > 0
      && "Code" in error.error
      && "Recommend" in error.error
      && "Message" in error.error);

  }

  initializeHttpApiErrorResponse(error: {
    Code: string,
    Message: string,
    HostId: string,
    RequestId: string,
    Recommend: string
  }) {
    if (this.httpApiErrorResponseTemplate && error) {
      this.displayTemplate = this.httpApiErrorResponseTemplate;
      this.contextExp = {
        code: error.Code,
        hostId: error.HostId,
        message: error.Message,
        requestId: error.RequestId,
        recommend: error.Recommend
      }
    }
  }

  initializeHttpErrorResponse(httpErrorResponse: HttpErrorResponse) {
    if (this.httpErrorResponseTemplate && httpErrorResponse) {
      this.displayTemplate = this.httpErrorResponseTemplate;
      const name = this.getUrlPath(httpErrorResponse.url);
      let code = httpErrorResponse.status
      const message = httpErrorResponse.message
      const requestId = null;
      if (code == undefined) {
        code = 500
      }
      this.contextExp = {
        code: code,
        name: name,
        message: message,
        requestId: requestId
      }
    }
  }


  getUrlPath(url: string | null) {
    if (url) {
      const index = url.indexOf("?")
      if (index != -1) {
        url = url.substring(0, url.indexOf("?"))
      }
    }
    return url;
  }

}
