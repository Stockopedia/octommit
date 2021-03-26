docker: 
	docker build -t stockopedia/octommit:$(version) . --build-arg NPM_TOKEN=$(token) --build-arg TAG=$(version)
trufflehog:
	truffleHog --regex --entropy=False . --exclude_paths .truffelhog