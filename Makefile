all: push

push: compile
	git add .
# commit with date
	git commit -m "Build on `date +'%Y-%m-%d %H:%M:%S'`"
	git push origin master

compile:
	npm run compile

.PHONY: push
