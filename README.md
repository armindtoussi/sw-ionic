# sw-ionic
Ionic app that allows you to view various star wars information


This application is being used to learn ionic. 
Built in my down time, it will access the swapi.co, to display various data about the star wars universe. 

Rate Limits 
------------
swapi.co tracks rate limits by individual IP, and can handle 10,000 requests per day. 
For more information see here : https://swapi.co/documentation#rate


Next Todo
-----------
Need to go back and fix toPromise() on components as i learned using toPromise() in 
rxjs observables is considered an anti-pattern in most situations. So this needs to be fixed. 

I also want to go back and make individual services for each page, use those to consume the 
api, and modify the data and pass that back to each individual page rather than have the 
pages/components do the heavy lifting.

Then we need to fix the navigation to the "display" pages. right now it's not popping off properly, 
when we hit the back button it's not the correct back flow. - not sure how to approach this, i've found 
little in the way of ion-nav information and how to push and pop with i-v4 using the back button. 

From there new features. 

Get working on android w/Cordova - having issues with libraries, sdks and their env paths.

Completed
----------

Fixed loading to home page rather than movie component. 