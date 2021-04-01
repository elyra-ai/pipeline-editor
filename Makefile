.PHONY: clean
clean:
	npx lerna exec "rm -rf node_modules dist build"
	rm -rf node_modules

.PHONY: link
link:
	yarn lerna run link

.PHONY: watch
watch:
	FORCE_COLOR=true yarn lerna run watch --parallel --stream

.PHONY: fix
fix:
	yarn eslint . --fix --ignore-path .gitignore --ext .ts,.tsx
