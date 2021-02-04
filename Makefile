.PHONY: clean
clean:
	npx lerna exec "rm -rf node_modules dist build"
	rm -rf node_modules
	
.PHONY: install
install:
	yarn install
	yarn lerna bootstrap

.PHONY: build
build:
	yarn lerna run build --stream

.PHONY: watch
watch:
	FORCE_COLOR=true yarn lerna run watch --parallel --stream


.PHONY: start
start:
	FORCE_COLOR=true yarn lerna run start --scope demo --stream

.PHONY: fix
fix:
	yarn eslint . --fix --ignore-path .gitignore --ext .ts,.tsx

.PHONY: lint
lint:
	yarn eslint . --ignore-path .gitignore --ext .ts,.tsx

.PHONY: test
test:
	npm run test