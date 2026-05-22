package main

import (
	"log"

	"github.com/mdtsk/blog/apps/api/internal/platform/config"
	platformhttp "github.com/mdtsk/blog/apps/api/internal/platform/http"
	"github.com/mdtsk/blog/apps/api/internal/store"
)

func main() {
	cfg := config.Load()
	if err := store.Init(cfg.DBConnectionString); err != nil {
		log.Fatal(err)
	}
	router := platformhttp.NewRouter(cfg)

	log.Printf("starting api server on %s", cfg.HTTPAddr)
	if err := router.Run(cfg.HTTPAddr); err != nil {
		log.Fatal(err)
	}
}
