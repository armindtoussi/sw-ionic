// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  swapiBase: 'https://swapi.co/api/',
  swapiPeople: 'people/',
  swapiMovies: 'films/',
  swapiPlanets: 'planets/',
  swapiSpecies: 'species/',
  swapiShips: 'starships/',
  swapiVehicles: 'vehicles/',
  swapiSearch: '?search=',

  MOVIES_KEY: 'sw-movies',
  CHARACTERS_KEY: 'sw-characters',
  CHARS_DICT_KEY: 'sw-chars-dict',
  PLANET_KEY: 'sw-planets',
  PLANET_DICT_KEY: 'sw-planet-dict',
  SHIPS_KEY: 'sw-ships',
  SHIPS_DICT_KEY: 'sw-ships-dict',
  SPECIES_KEY: 'sw-species',
  SPECIES_DICT_KEY: 'sw-species-dict',
  VEHICLE_KEY: 'sw-vehicle',
  VEHICLE_DICT_KEY: 'sw-vehicle-dict',


  notFound: 'We could not find the droids you\'re looking for...',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error',  // Included with Angular CLI.
