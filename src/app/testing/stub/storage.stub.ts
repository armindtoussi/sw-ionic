import { StorageService } from 'src/app/services/storage.service';
import { Film } from 'src/app/models/films.model';
import { Storage } from '@ionic/storage';
var moviesJSON = require('../testing/data/movies.json');


export class StorageStub extends Storage {

    entries = {
        1 : "something",
        2 : "something else"
    };

    constructor(config) {
        super(config);
    }


    get(id: string): Promise<any> {
        return this.entries[id];
    }
    
}