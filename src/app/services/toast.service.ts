import { Injectable } from '@angular/core';
//Ionic
import { ToastController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class ToastService {


    constructor(private toastCtrl: ToastController) { }

    async presentToast(msg: string): Promise<void> {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 2000,
            buttons: [
                {
                    text: 'Okay',
                    role: 'cancel',
                }
            ]
        });
        return toast.present();
    }
}