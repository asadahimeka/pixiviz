/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("/js/workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/js/workbox-v4.3.1"});

importScripts(
  "/js/precache-manifest.d8707cecb41956ceb229806ccf10a6f5.js"
);

workbox.core.setCacheNameDetails({prefix: "pixiviz"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/^https:\/\/pixiviz\.kanata\.ml(\/.*\.(html|js|css))?$/, new workbox.strategies.NetworkFirst({ "cacheName":"static-files","networkTimeoutSeconds":10, plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 604800, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/pixiviz\.kanata\.ml(\/.*\.(jpg|jpeg|png|webp|svg))?$/, new workbox.strategies.CacheFirst({ "cacheName":"static-imgs", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 259200, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^(https:\/\/hm\.baidu\.com\/hm\.js)|(https:\/\/cdn-go\.cn\/aegis\/aegis-sdk\/latest\/aegis\.min\.js)/, new workbox.strategies.CacheFirst({ "cacheName":"stat-files", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 259200, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/((pixiviz\.pwp\.app\/api\/)|(pixiviz-api-[a-z]{2}\.pwp\.link\/)).+/, new workbox.strategies.CacheFirst({ "cacheName":"api-return", plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 604800, maxEntries: 30000, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/gfonts\.pwp\.link\/.*$/, new workbox.strategies.CacheFirst({ "cacheName":"gfont","fetchOptions":{"credentials":"omit","mode":"cors"}, plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 7776000, maxEntries: 500, purgeOnQuotaError: false })] }), 'GET');
workbox.routing.registerRoute(/^https:\/\/pic1\.afdiancdn\.com\/.*$/, new workbox.strategies.CacheFirst({ "cacheName":"sponsor-avatar","fetchOptions":{"credentials":"omit","mode":"cors"}, plugins: [new workbox.cacheableResponse.Plugin({ statuses: [ 0, 200 ] }), new workbox.expiration.Plugin({ maxAgeSeconds: 86400, maxEntries: 50, purgeOnQuotaError: false })] }), 'GET');
