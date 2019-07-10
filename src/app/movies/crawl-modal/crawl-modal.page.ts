import { Component, Input, OnInit }   from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import * as $ from 'jquery';

@Component({
    selector: 'crawl-modal',
    templateUrl: './crawl-modal.page.html',
    styleUrls: ['./crawl-modal.page.scss'],
})
export class CrawlModalPage implements OnInit {

    @Input() crawlText: string;
    @Input() title: string;
    @Input() id: string; 

    audio = new Audio();

    constructor(private navParams: NavParams,
                private modalCtrl: ModalController,) { }

    ngOnInit(): void {
        this.crawlText = this.navParams.get('crawl');
        this.title = this.navParams.get('title');
        this.id = this.navParams.get('id');
        this.onAudio();
        this.startCrawl();
    }

    dismiss(): void {
        console.log("dismissing();");
        this.modalCtrl.dismiss();
        this.audio.pause();
    }

    private startCrawl(): void {
        setTimeout(() => {
            $('.crawl').css('display', 'block');
            $('.intro').css('display', 'none');
        }, 9000);
    }
    
    private onAudio(): void {
        this.audio.src="https://s.cdpn.io/1202/Star_Wars_original_opening_crawl_1977.mp3";
        this.audio.load();
        this.audio.play();
    }
}