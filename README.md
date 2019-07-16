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

Think about setting up a firebase to CDN images, would be a big job would have to link api -> firebase 
Something for later, is to implement either loading spinners or maybe ion-skeleton-text.
Think about new feature possibilities. ?
    - favourites list, 
    - search feature(done)
    - 

Completed
----------

Fixed loading to home page rather than movie component. 
Fixed toPromise usage on components due to it being an anti pattern with rxjs.

Finished up display pages. 
Decided on removing a large portion of the caching, it didn't really make sense to, basically, cache everything in a local storge on the user device. I'd basically, eventually, be downloading the entire api contents on to a user device. Instead we're just keeping track of current selection via url. We can download things as needed through the api. 
I may implement some light caching later. Just to reload what the user is currently on when they paused the app. 

Completed color theme, added some new icons. 

July 16, 2019 - implemented search feature for each individual list page. Infinite scroll implemented on search results also.