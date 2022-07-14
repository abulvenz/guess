rm -rf dist \
&& parcel build --dist-dir docs --public-url . index.html \
&& git add . \
&& git commit \
&& git push