package config

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

type Config struct {
	HTTPAddr           string
	AppEnv             string
	DBConnectionString string
	AdminSessionSecret string
}

func Load() Config {
	loadDotEnv()

	return Config{
		HTTPAddr:           envOrDefault("HTTP_ADDR", ":8080"),
		AppEnv:             envOrDefault("APP_ENV", "development"),
		DBConnectionString: loadDBConnectionString(),
		AdminSessionSecret: strings.TrimSpace(os.Getenv("ADMIN_SESSION_SECRET")),
	}
}

func loadDBConnectionString() string {
	host := strings.TrimSpace(os.Getenv("DB_HOST"))
	port := strings.TrimSpace(os.Getenv("DB_PORT"))
	database := strings.TrimSpace(os.Getenv("DB_DATABASE"))
	username := strings.TrimSpace(os.Getenv("DB_USERNAME"))
	password := os.Getenv("DB_PASSWORD")

	if host != "" && port != "" && database != "" && username != "" {
		return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", username, password, host, port, database)
	}

	return strings.TrimSpace(os.Getenv("DB_CONNECTION_STRING"))
}

func envOrDefault(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}

	return value
}

func loadDotEnv() {
	candidates := []string{
		filepath.Join(".", ".env"),
		filepath.Join("..", ".env"),
		filepath.Join("..", "..", ".env"),
	}

	for _, path := range candidates {
		if applyDotEnv(path) {
			return
		}
	}
}

func applyDotEnv(path string) bool {
	file, err := os.Open(path)
	if err != nil {
		return false
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		value = strings.Trim(value, `"'`)
		if key == "" {
			continue
		}

		if _, exists := os.LookupEnv(key); !exists {
			_ = os.Setenv(key, value)
		}
	}

	return true
}
