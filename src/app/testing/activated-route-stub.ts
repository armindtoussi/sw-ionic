import { ParamMap, Params, convertToParamMap } from '@angular/router';
import { ReplaySubject } from 'rxjs';


export class ActivatedRouteStub {
    //Using a ReplaySubject to share previous values with subs
    //and pump new values into the `paramMap` observable.
    private subject = new ReplaySubject<ParamMap>();

    constructor(initialParams?: Params) {
        this.setParamMap(initialParams);
    }

    /* The mock paramMap observable */
    readonly paramMap = this.subject.asObservable();

    /* Set the paramMap obserable's next value. */
    setParamMap(params?: Params): void {
        this.subject.next(convertToParamMap(params));
    }
}