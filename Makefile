ISTANBUL = node_modules/.bin/istanbul
JSHINT = node_modules/.bin/jshint
NFMT = node_modules/.bin/nfmt

.DEFAULT_GOAL := annoy

.PHONY: annoy
annoy:
	$(MAKE) format lint test

.PHONY: publish
publish:
	yarn publish

.PHONY: format
format:
	$(NFMT)

.PHONY: lint
lint:
	$(JSHINT) -- index.js test/index.js

.PHONY: setup
setup:
	yarn

.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha
	$(ISTANBUL) check-coverage --branches 100
