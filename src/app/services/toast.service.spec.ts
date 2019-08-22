//Service.
import { ToastService } from "./toast.service";
//Ionic
import { ToastController } from '@ionic/angular';
//NgTesting
import { fakeAsync,tick, TestBed } from '@angular/core/testing';

class ToastControllerMock {
    constructor() { }

    create(obj: object): HTMLIonToastElement {
        return new HTMLIonToastElement();
    }
}
class HTMLIonToastElement {
    constructor() {}

    present() {
        return "hello";
    }
}

describe('ToastService', () => {
    let toastService: ToastService;
    let toastCtrl: ToastController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ToastService,
                { provide: ToastController, useClass: ToastControllerMock },
            ]
        });
    });

    beforeEach(() => {
        toastCtrl = TestBed.get(ToastController);
        toastService = TestBed.get(ToastService);
    });

    it('[#presentToast] should call and create toast and call present', fakeAsync(() => { 
        let spy = spyOn(toastService, 'presentToast').and.callThrough();
        let tSpy = spyOn(toastCtrl, 'create').and.callThrough();

        toastService.presentToast("testing");

        tick();

        expect(spy).toHaveBeenCalled();
        expect(tSpy).toHaveBeenCalled();
    }));
});