//Service.
import { ToastService } from "./toast.service";
import { ToastController } from '@ionic/angular';


describe('ToastService', () => {
    let toastCtrlSpy: { get: jasmine.Spy};
    let toastService: ToastService;

    beforeEach(() => {
        toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);
        toastService = new ToastService(<any>toastCtrlSpy); //create service and inject spy DI;
    });

    xit('should create the toast', async () => {
        spyOn(toastService, 'presentToast');
        await toastService.presentToast("it's a toast");
        expect(toastService.presentToast).toHaveBeenCalled();
    });
    // todo - come back here to figure out more tests. weird right now.
});