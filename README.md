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

Get working on android w/Cordova - having issues with libraries, sdks and their env paths.

Completed
----------

Fixed loading to home page rather than movie component. 
Fixed toPromise usage on components due to it being an anti pattern with rxjs.

Finished up display pages. 
Decided on removing a large portion of the caching, it didn't really make sense to, basically, cache everything in a local storge on the user device. I'd basically, eventually, be downloading the entire api contents on to a user device. Instead we're just keeping track of current selection via url. We can download things as needed through the api. 
I may implement some light caching later. Just to reload what the user is currently on when they paused the app. 
