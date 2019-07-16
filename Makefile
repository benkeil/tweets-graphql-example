clean:
	cd code; npm run clean

init:
	npm install --prefix code/ code/

build: clean
	cd code; npm run build

deploy:
	aws lambda update-function-code \
	    --function-name buyme-crawl-profiles \
	    --zip-file fileb://code/dist/crawl-profiles.zip
	aws lambda update-function-code \
	    --function-name buyme-crawl-profile \
	    --zip-file fileb://code/dist/crawl-profile.zip
	aws lambda update-function-code \
	    --function-name buyme-parse-profile \
	    --zip-file fileb://code/dist/parse-profile.zip

buploy: build deploy

run:
	cd code; nodemon --config ./scripts/nodemon.json
