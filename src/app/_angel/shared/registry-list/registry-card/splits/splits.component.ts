import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ProfileService } from 'src/app/_angel/profile/profile.service';

@Component({
  selector: 'app-splits',
  templateUrl: './splits.component.html',
  styleUrls: ['./splits.component.scss']
})
export class SplitsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @Input() selectedRegister: any;
  @Input() operationType: any;
  splits: any[] = [];
  isFlipped = false;
  form: FormGroup;
  companies: any[] = [];
  departments: any[] = [];
  positions: any[] = [];
  jobs: any[] = [];
  subCompanies: any[] = [];
  collars: any[] = [];
  directorships: any[] = [];

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private translateService: TranslateService
  ) {}
  
  ngOnInit(): void {
    this.createForm();
    this.getSplits();
    this.getValues();
  }

  createForm() {
    this.form = this.fb.group({
      startDate: [""],
      endDate: [""],
      company: [""],
      department: [""],
      position: [""],
      job: [""],
      subCompany: [""],
      directorship: [""],
      collar: [""]
    });
  }

  toggleFlip() {
    this.isFlipped = !this.isFlipped;
  }

  getSplits() {
    var sp: any[] = [
      { mkodu: 'yek213', sicilid: this.selectedRegister.Id.toString() }
    ];

    this.profileService.requestMethod(sp).pipe(takeUntil(this.ngUnsubscribe)).subscribe((response) => {
      const data = response[0].x;
      const message = response[0].z;

      if (message.islemsonuc == -1) {
        return;
      }

      this.splits = [...data];
      console.log("Splitler Geldi :", this.splits);
      
      this.splits.sort((a, b) => {
        if (a.Donembaslangic === null) return 1;
        if (b.Donembaslangic === null) return -1;
      
        const dateA = new Date(a.Donembaslangic);
        const dateB = new Date(b.Donembaslangic);
      
        return dateA.getTime() - dateB.getTime(); 
      });
    });
  }

  getValues() {
    var sp: any[] = [
      { mkodu: 'yek041', kaynak: 'cbo_firma', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_bolum', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_pozisyon', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_gorev', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_altfirma', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_yaka', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_direktorluk', id: '0'},
      { mkodu: 'yek041', kaynak: 'cbo_puantaj', id: '0'}
    ];

    this.profileService
      .requestMethod(sp)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((response: any) => {
        const data = response;
        
        data.forEach((item:any, index: any) => {
          if (item.z.islemsonuc == -1) {
            return;
          }

          if (index == 0) {
            this.companies = [...item.x];
            console.log('Firma Geldi: ', this.companies);

          } else if (index == 1) {
            this.departments = [...item.x];
            console.log('Firma Geldi: ', this.departments);

          } else if (index == 2) {
            this.positions = [...item.x];
            console.log('Firma Geldi: ', this.positions);

          } else if (index == 3) {
            this.jobs = [...item.x];
            console.log('Firma Geldi: ', this.jobs);

          } else if (index == 4) {
            this.subCompanies = [...item.x];
            console.log('Firma Geldi: ', this.subCompanies);

          } else if (index == 5) {
            this.collars = [...item.x];
            console.log('Firma Geldi: ', this.collars);

          } else if (index == 6) {
            this.directorships = [...item.x];
            console.log('Firma Geldi: ', this.directorships);

          }
          
        });
      }, (err) => {
        this.toastrService.error(
          this.translateService.instant('Beklenmeyen_Bir_Hata_Oluştu'),
          this.translateService.instant('Hata')
        );
      });
  }

  addSplit() {
  }

  
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

}
