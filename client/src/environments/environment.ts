// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDfDqBbo4bTjYbjlfJADm0gAtPEZwl4lak",
    authDomain: "stm-map.firebaseapp.com",
    projectId: "stm-map",
    storageBucket: "stm-map.appspot.com",
    messagingSenderId: "370121352113",
    appId: "1:370121352113:web:19d1ff99b0df228d3a1390",
    measurementId: "G-TTV15T0ECS"
  },
  server_url: 'http://localhost:3080/api',
  coordinate_endpoint: '/coordinates',
  rss_endpoint: '/rssData',
  env_name: 'local'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
