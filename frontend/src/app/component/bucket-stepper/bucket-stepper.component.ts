import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  OnDestroy,
} from '@angular/core';
import { IFamilyDetails, IFamilyResponse, IBucketDetails } from './../../models/data.model';
import { BucketDataTransferService } from './../../services/bucket.data.transfer.service'
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { BucketComponent } from '../bucket/bucket.component';
import { BucketDialogComponent } from '../bucket-dialog/bucket-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { DataTransferService } from 'src/app/services/data.transfer.service';
import { DataService } from './../../services/data.service';
import { slider } from 'src/app/route-animations';
import { from } from 'rxjs';

@Component({
  selector: 'app-bucket-stepper',
  templateUrl: './bucket-stepper.component.html',
  styleUrls: ['./bucket-stepper.component.css'],
  animations: [slider],
})
export class BucketStepperComponent implements OnInit, OnDestroy {
  // getting the child components with id = 'cmp' as an iterable list
  @ViewChildren('cmp') bucketQueryList: QueryList<BucketComponent>;

  // Data of a single person - For POST Req
  // api response - commented out for frontend********
  postData: IFamilyDetails;

  // id generated from landing
  landingId: string;

  // bucket data from
  bucket_data: any;

  // Array for number of family members
  members: any[];

  // current bucket
  indexBucket: number;

  // No of family members
  noOfBuckets: number;

  // current value of the progress
  progressValue = 0;

  // value of a single step
  progressStepCost = 0;

  // Array for hold buckets
  bucketStates: string[];

  // Array to hold carouselStates
  carouselStates: any[];

  //hold details of post bucket
  postBucketData: IBucketDetails;

  //hold response from family post
  family_response: IFamilyResponse;

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private dataTransferService: DataTransferService,
    private bucketDataTransfer: BucketDataTransferService,
    private dataService: DataService
  ) {
    this.carouselStates = [];
    this.bucketStates = [];
    this.carouselStates = [];
    this.indexBucket = 0;
  }

  ngOnInit(): void {
    // ------------------------Activate Route Guard---------------------------- //
    // uncomment this out when you are ready to apply route guard for bucket.
    //Please make sure
    //1.comment out the Deactivate Route Guard area below.
    //2.uncomment out activate route guard in the landing page and
    //3.uncomment out activate route guard area the in the bucket path of app.routing.module

    // check route came from landing****************
    // catch the landing id generated from landing
    this.route.params.subscribe((params) => {
      this.landingId = params.id;
    });

    if (this.dataTransferService === undefined && this.postData == undefined) {
      this.postData = null;
      this.router.navigateByUrl('/home');
    } else {
      // catch data from landing using data transfer service
      this.postData = this.dataTransferService.get_family_data();
      // destroying the instance
      this.dataTransferService = null;
      if (
        !this.landingId ||
        !this.postData ||
        this.landingId !== this.postData.id
      ) {
        this.postData = null;
        this.router.navigateByUrl('/home');
      } else {
        // Setting number of buckets according to the received number of family members
        // this.noOfBuckets = +this.postData.family_members;

        // api response - commented out for frontend********

        this.noOfBuckets = +this.postData.n_family_members;

        // constructing the dummy array for stepper
        this.members = this.giveMeDummy(this.noOfBuckets);

        // calculate the value for a single step
        this.progressStepCost = 100 / this.noOfBuckets;

        // setting the staring value of the progress
        this.progressValue = 0;
      }
    }
    //-----------------------------------------------------------------------------//

    // // ------------------------Deactivate Route Guard---------------------------- //
    // // uncomment this out when you want to deactivate route guard for bucket.
    // //Please make sure
    // //1.comment out the Activate Route Guard area above.
    // //2.uncomment out deactivate route guard in the landing page and
    // //3.uncomment out deactivate route guard area the in the bucket path of app.routing.module
    // if (
    //   this.dataTransferService !== undefined &&
    //   this.dataTransferService != null
    // ) {
    //   this.postData = this.dataTransferService.get_family_data();
    // }

    // // Setting number of buckets according to the received number of family members
    // // this.noOfBuckets = +this.postData.family_members;

    // // api response - commented out for frontend********

    // this.noOfBuckets = +this.postData.n_family_members;

    // // constructing the dummy array for stepper
    // this.members = this.giveMeDummy(this.noOfBuckets);

    // // calculate the value for a single step
    // this.progressStepCost = 100 / this.noOfBuckets;

    // // setting the staring value of the progress
    // this.progressValue = 0;
    // //............................................................................
  }

  ngOnDestroy(): void {
    //destroy instances to prevent coming back from end page
    this.postData = null;
  }

  // dummy array creator
  giveMeDummy(n: number): any[] {
    return Array(n);
  }

  // method to save bucket states by deep copying the array
  saveState(bucketList) {
    this.bucketStates[this.indexBucket] = JSON.parse(
      JSON.stringify(bucketList[this.indexBucket].currentBucket)
    );
  }

  // Next of Stepper - Next bucket
  goForward(stepper: MatStepper) {
    if (!this.isBucketFull()) {
      this.showBucketNoFilledAlert();
    } else {
      if (this.indexBucket < this.noOfBuckets - 1) {
        // pass the iterable list as an array to the saveState method
        this.saveState(this.bucketQueryList.toArray());
        // //get the bucket data from bucket component
        // this.bucket_data = this.dataTransferService.get_bucket_data();
        // next
        this.indexBucket = this.indexBucket + 1;
        stepper.next();
        this.progressValue += this.progressStepCost;
        //show alert if current bucket is full
        if (this.isBucketFull()) {
          this.showBucketFilledAlert();
        }

        // POST REQ
        // ----------------------------------------------
        // ----------------------------------------------
        // ----------------------------------------------
        // //------------------------Enable API POST--------------------------------------------//
        // //uncomment this out when you are ready to let the api,  connect with front end
        this.postBucketData = this.bucketDataTransfer.get_bucket_data();
        this.family_response = this.bucketDataTransfer.get_family_response();
        this.dataService.post_bucket_data(this.postBucketData, this.family_response,this.indexBucket).subscribe((bucket_data) => {
         });
        // //---------------------------------------------------------------------------//

        // //------------------------Disable API POST-----------------------------------//
        //comment this out when you are ready to let the api connect with front end
      }
    }
  }

  // Back of Stepper - Previous bucket
  goBack(stepper: MatStepper) {
    if (this.indexBucket > 0) {
      // pass the iterable list as an array to the saveState method
      this.saveState(this.bucketQueryList.toArray());

      // previous
      this.indexBucket = this.indexBucket - 1;

      stepper.previous();
      this.progressValue -= this.progressStepCost;
      //show alert if current bucket is full
      if (this.isBucketFull()) {
        this.showBucketFilledAlertAlready();
      }

      // POST REQ
      // ----------------------------------------------
      // ----------------------------------------------
      // ----------------------------------------------
      // this.postBucketData = this.bucketDataTransfer.get_bucket_data();
      //   this.family_response = this.bucketDataTransfer.get_family_response();
      //   this.dataService.post_bucket_data(this.postBucketData, this.family_response).subscribe((bucket_data) => {
      //   });
      
    }
  }

  openDialog(): void {
    this.bucketQueryList.toArray()[this.indexBucket].openDialog();
  }

  // submitter at the last step
  onDone(): void {
    if (!this.isBucketFull()) {
      this.showBucketNoFilledAlert();
    } else {
      
      this.postBucketData = this.bucketDataTransfer.get_bucket_data();
      //console.log(this.postBucketData.gender);
        this.family_response = this.bucketDataTransfer.get_family_response();
        //console.log(this.family_response.DATA.id);
       this.dataService.post_bucket_data(this.postBucketData, this.family_response,this.indexBucket + 1).subscribe((bucket_data) => {
        });
      this.router.navigate(['./end'], { replaceUrl: true });
    }
  }

  // is the current Bucket completely filled
  isBucketFull(): boolean {
    if (this.postData == null) {
      return false;
    } else {
      const bucketArr = this.bucketQueryList;
      if (bucketArr === undefined) {
        return false;
      } else {
        return (
          bucketArr.toArray()[this.indexBucket].currentBucket.length ===
          bucketArr.toArray()[this.indexBucket].carouselArray.length
        );
      }
    }
  }

  // show alert toaster - if bucket not completed
  showBucketNoFilledAlert() {
    this.toastr.info('please complete the current bucket', 'Incomplete', {
      // toastClass:"ngx-toast",
      timeOut: 1500,
      extendedTimeOut: 1000,
      // closeButton: true,
      positionClass: 'toast-center-center',
      tapToDismiss: true,
    });
  }

  showBucketFilledAlert() {
    //two options when lase(all) buckets filled and current bucket is filled
    let errorMessages: { msg: string; head: string }[] = [
      {
        msg: 'this bucket is complete.',
        head: 'Click Next',
      },
      {
        msg: 'all buckets completed',
        head: 'Click Done',
      },
    ];
    let errorMessage: { msg: string; head: string } =
      this.indexBucket + 1 != this.noOfBuckets
        ? errorMessages[0]
        : errorMessages[1];
    this.toastr.success(errorMessage.msg, errorMessage.head, {
      timeOut: 3000,
      extendedTimeOut: 1000,
      positionClass: 'toast-center-center',
      tapToDismiss: true,
    });
  }

  showBucketFilledAlertAlready() {
    this.toastr.success('already completed bucket', 'Completed', {
      timeOut: 1500,
      extendedTimeOut: 1000,
      positionClass: 'toast-center-center',
      tapToDismiss: true,
    });
  }
}
