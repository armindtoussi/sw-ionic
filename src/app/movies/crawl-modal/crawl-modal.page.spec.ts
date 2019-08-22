import { async, TestBed, ComponentFixture, fakeAsync, tick } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { CrawlModalPage } from './crawl-modal.page';



class NavParamsMock {
    constructor() { }

    get(str: string): any {
        return str;
    }
}
class ModalControllerMock {
    constructor() {}
  
    create(obj: object): Modal {
      return new Modal();
    }

    dismiss() {
        return "dismiss";
    }
}
  
  class Modal {
    constructor() { }
  
    present() {
      return "Hello";
    }
}

describe('CrawlModalPage', () => {
    let component: CrawlModalPage;
    let fixture: ComponentFixture<CrawlModalPage>;
    let modalCtrl: ModalController;
    let navParams: NavParams;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CrawlModalPage ],
            schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
            providers: [
                { provide: NavParams, useClass: NavParamsMock },
                { provide: ModalController, useClass: ModalControllerMock }, 
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        modalCtrl = TestBed.get(ModalController);
        navParams = TestBed.get(NavParams);

        fixture = TestBed.createComponent(CrawlModalPage);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        modalCtrl = null;
        navParams = null;
        fixture = null;
        component = null; 
    });

    it('should create CrawlModalPage', () => {
        expect(component).toBeTruthy();
    });

    it('[#dismiss] should dismiss modal and pause audio', () => {
        let spy = spyOn(modalCtrl, 'dismiss').and.callThrough();
        let aSpy = spyOn(component.audio, 'pause').and.callThrough();

        component.dismiss();

        expect(spy).toHaveBeenCalled();
        expect(aSpy).toHaveBeenCalled();
    });

    it('[#startCrawl] should grab elements, and set a timeout to start', fakeAsync(() => {
        
        component.startCrawl();

        tick(9002);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            expect(document.getElementById('crawl').style.display).toEqual('block');
            expect(document.getElementById('intro').style.display).toEqual('none');
        });
    }));
});