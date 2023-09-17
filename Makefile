
push:
	git add .
# commit with date
	git commit -m "Build on `date +'%Y-%m-%d %H:%M:%S'`"
	git push origin master

.PHONY: push