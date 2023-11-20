import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  currency = '$';
  loaderShowed = true;
  loader = true;

  orderImageStyle: any;
  mainImageStyle: any;

  form = this.fb.group({
    order: ["", Validators.required],
    name: ["", Validators.required],
    phone: ["", Validators.required],
  });

  productsData: any;

  constructor (private fb: FormBuilder, private appService: AppService) {
  }

@HostListener('document:mousemove', ['$event'])
onMouseMove(e: MouseEvent) {
    this.orderImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3)/8) + 'px,-' + ((e.clientY * 0.3)/8) + 'px)'};
    this.mainImageStyle = {transform: 'translate(-' + ((e.clientX * 0.3)/8) + 'px,-' + ((e.clientY * 0.3)/8) + 'px)'};
  }

  ngOnInit(){
    setTimeout(() => {
      this.loaderShowed = false;
    }, 3200);

    setTimeout(() => {
      this.loader = false;
    }, 4200);

    this.appService.getData().subscribe(data => this.productsData = data);
  }

  scrollTo(target: HTMLElement, burger?: any){
    target.scrollIntoView({behavior: 'smooth'});

    if (burger) {
      this.form.patchValue({order: burger.title + ' (' + burger.price + ' ' + this.currency + ')'});
    }
  }

  confirmOrder(){
    if (this.form.valid){
      this.appService.sendOrder(this.form.value)
      .subscribe(
        {
          next: (response: any) => {
            alert(response.message);
            this.form.reset();
          },
          error: (response) => {
            alert(response.error.message);
          }
        }
      );
  }
}

  changeCurrency(){

        let newCurrency = "$";
        let coef = 1;

        if (this.currency === "$"){
            newCurrency = "₽"
            coef = 89;
        } else if(this.currency === "₽"){
            newCurrency = "BYN";
            coef = 3;
        } else if (this.currency === 'BYN') {
            newCurrency = '€';
            coef = 0.9;
        } else if (this.currency === '€') {
            newCurrency = '¥';
            coef = 6.9;
        }

        this.currency = newCurrency;

        this.productsData.forEach((item: any) => {
          item.price = +(item.basePrice * coef).toFixed(1);
        });
  }

}
