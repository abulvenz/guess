rm -rf dist \
&& npx parcel build --dist-dir docs --public-url . index.html \
&& git add . \
&& git commit \
&& git push
