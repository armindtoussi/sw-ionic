import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/services/toast.service';



@Component({
    selector: 'test-component',
    template: `<ion-content id="content"></ion-content>`,
})
export class TestComponent implements OnInit {


    constructor(private _toast: ToastService) { }

    ngOnInit(): void {
        this._toast.presentToast('messaged');
    }
}