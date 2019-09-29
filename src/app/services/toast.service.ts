// Ng
import { Injectable } from '@angular/core';
// Ionic
import { ToastController } from '@ionic/angular';


@Injectable({
    providedIn: 'root'
})
export class ToastService {


    constructor(private toastCtrl: ToastController) { }

    /**
     * Presents an ionic toast message on the screen.
     * @param msg the message.
     */
    async presentToast(msg: string): Promise<void> {
        const toast = await this.toastCtrl.create({
            message: msg,
            duration: 100000,
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