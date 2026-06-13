# PerioOrbit 3D — comandi rapidi
# Uso:  make <target>   (es. `make up`)

.DEFAULT_GOAL := help
.PHONY: help install dev build preview clean up down logs docker-dev rebuild

# URL mostrata dopo l'avvio del container
PROD_URL := http://localhost:8080

help: ## Mostra questo aiuto
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

# ---------------------------------------------------------------- Docker (consigliato)

up: ## Build dell'immagine + avvio container, poi mostra la URL
	@echo "🛠️  Build dell'immagine Docker e avvio del container..."
	docker compose up -d --build prod
	@echo ""
	@echo "  ✅  PerioOrbit 3D è ATTIVO!"
	@echo "  🌐  Apri nel browser:  \033[36m$(PROD_URL)\033[0m"
	@echo ""
	@echo "  (per fermarlo:  make down)"

down: ## Ferma e rimuove i container
	docker compose down

rebuild: ## Ricostruisce da zero (senza cache) e riavvia
	docker compose build --no-cache prod
	docker compose up -d prod
	@echo "  🌐  $(PROD_URL)"

logs: ## Mostra i log del container
	docker compose logs -f prod

docker-dev: ## Sviluppo in Docker con hot-reload (http://localhost:5173)
	docker compose up dev

# ---------------------------------------------------------------- Locale (senza Docker)

install: ## Installa le dipendenze npm
	npm install

dev: ## Server di sviluppo locale (http://localhost:5173)
	npm run dev

build: ## Build di produzione in ./dist
	npm run build

preview: build ## Anteprima locale della build (http://localhost:4173)
	npm run preview

clean: ## Rimuove node_modules e dist
	rm -rf node_modules dist
