.PHONY: clean
clean:
	npx lerna exec "rm -rf node_modules dist build"
	rm -rf node_modules
	
.PHONY: install
install:
	yarn install

.PHONY: link
link:
	yarn lerna run link

.PHONY: build
build:
	yarn lerna run build --stream

.PHONY: watch
watch:
	FORCE_COLOR=true yarn lerna run watch --parallel --stream

.PHONY: fix
fix:
	yarn eslint . --fix --ignore-path .gitignore --ext .ts,.tsx

.PHONY: lint
lint:
	yarn eslint . --ignore-path .gitignore --ext .ts,.tsx --max-warnings=0

.PHONY: test
test:
	yarn jest --coverage
	yarn test:cypress