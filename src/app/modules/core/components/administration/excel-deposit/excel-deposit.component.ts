import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth/auth.service';
import { PopupService } from 'src/app/modules/shared/services/popup/popup.service';

@Component({
  selector: 'sfc-excel-deposit',
  templateUrl: './excel-deposit.component.html',
  styleUrls: ['./excel-deposit.component.scss'],
})
export class ExcelDepositComponent {
  showDownloadPage: boolean = false;
  apiUrl: string = 'https://startupfoundercanvas.alwaysdata.net/api/excel/';
  excelFile: string[][] = [
    ['FAQ-CANVAS.xlsx', 'FAQ'],
    ['CASE-CANVAS.xlsx', 'canvas'],
    ['ADMINISTRATIF-CANVAS.xlsx', 'administratif'],
    ['ACCUEIL-CANVAS.xlsx', 'accueil'],
    ['STRUCTURE-CANVAS.xlsx', 'structure'],
    ['UTILISATEUR-CANVAS.xlsx', 'utilisateur'],
    ['MESSAGE-CANVAS.xlsx', 'message'],
  ];

  constructor(
    private http: HttpClient,
    private translate: TranslateService,
    private popupService: PopupService
  ) {}

  public upload(event: any, fileUpload: FileUpload): void {
    let file: File = event.files[0];
    const formData = new FormData();
    const header = new HttpHeaders({
      'Content-disposition': 'attachment; filename=' + file.name,
    });
    formData.append('file', file);
    this.http
      .post(this.apiUrl + 'upload' + '?adminToken=' + localStorage.getItem('token'), formData, {
        headers: header,
      })
      .subscribe({
        next: (data) => {
          if (data) {
            this.translate
              .get('excel-deposit.popup.upload-success')
              .subscribe((msg) => this.popupService.createPopup('is-success', msg));
          }
        },
        error: () => {
          this.translate
            .get('excel-deposit.popup.upload-fail')
            .subscribe((msg) => this.popupService.createPopup('is-danger', msg));
        },
      });
    fileUpload.clear();
  }

  public getFileName(index: number): string {
    return this.excelFile[index][0];
  }

  public downloadFile(index: number): void {
    this.http
      .get<File>(
        this.apiUrl +
          'download/' +
          this.excelFile[index][1] +
          '?adminToken=' +
          localStorage.getItem('token'),
        {
          responseType: 'blob' as 'json',
        }
      )
      .subscribe({
        next: (data) => {
          if (data) {
            this.translate
              .get('excel-deposit.popup.download-success')
              .subscribe((msg) => this.popupService.createPopup('is-success', msg));
            const blob = new Blob([data], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.getFileName(index);
            link.click();
          }
        },
        error: () => {
          this.translate
            .get('excel-deposit.popup.download-fail')
            .subscribe((msg) => this.popupService.createPopup('is-danger', msg));
        },
      });
  }
}
