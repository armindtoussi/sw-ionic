//Service.
import { ToastService } from "./toast.service";
import { ToastController } from '@ionic/angular';
import { fakeAsync,tick } from '@angular/core/testing';



describe('ToastService', () => {
    let toastCtrlSpy: { get: jasmine.Spy};
    let toastService: ToastService;

    beforeEach(() => {
        toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
        toastService = new ToastService(<any>toastCtrlSpy); //create service and inject spy DI;
    });

    // todo - come back here to figure out more tests. weird right now.
    it('should ', fakeAsync(() => { 
        spyOn(toastService, 'presentToast');
        toastService.presentToast("testing");

        tick();

        expect(toastService.presentToast).toHaveBeenCalled();
    }));
});