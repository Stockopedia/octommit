docker: 
	docker build -t stockopedia/octommit:$(version) . --build-arg NPM_TOKEN=$(token)