cp /usr/src/ui-switch.component.ts /usr/src/node_modules/angular2-ui-switch/src/ui-switch.component.ts
ng build --prod
rm /usr/src/src/css/fontawesome*
rm /usr/src/src/css/glyphicons*
rm /usr/src/src/css/roboto*
mv dist/inline.*.bundle.js /usr/src/src/js/inline.bundle.js
mv dist/main.*.bundle.js /usr/src/src/js/main.bundle.js
mv dist/styles.*.bundle.css /usr/src/src/css/styles.bundle.css
mv dist/vendor.*.bundle.js /usr/src/src/js/vendor.bundle.js
mv dist/polyfills.*.bundle.js /usr/src/src/js/polyfills.bundle.js
mv dist/scripts.*.bundle.js /usr/src/src/js/scripts.bundle.js
mv dist/*.eot /usr/src/src/css/
mv dist/*.svg /usr/src/src/css/
mv dist/*.woff2 /usr/src/src/css/
mv dist/*.ttf /usr/src/src/css/
mv dist/*.woff /usr/src/src/css/