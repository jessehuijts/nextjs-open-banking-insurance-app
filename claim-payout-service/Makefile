usage:           ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

install:         ## Install dependencies
	pnpm install

deploy:          ## Deploy the app
	@make install; \
		echo "Deploying Serverless app to local environment"; \
		SLS_DEBUG=1 npx serverless deploy --stage local
