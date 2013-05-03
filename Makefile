simple:
	beefy ./examples/simple/index.js:bundle.js 8998 --live 8898 -- -t ktbr --debug
livetest:
	# go to http://localhost:9478/testrunner_LIVE.html
	beefy test/suite.js:test.bundle.js 9478 --live 9479 -- -t ktbr --debug