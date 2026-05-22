package http

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/mdtsk/blog/apps/api/internal/platform/adminsession"
	"github.com/mdtsk/blog/apps/api/internal/platform/apiresponse"
)

func requireAdminSession(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		if secret == "" {
			apiresponse.Error(c, http.StatusServiceUnavailable, "admin_auth_not_configured", "admin session secret is not configured")
			c.Abort()
			return
		}

		header := c.GetHeader("Authorization")
		token := strings.TrimSpace(strings.TrimPrefix(header, "Bearer "))
		if token == "" {
			apiresponse.Error(c, http.StatusUnauthorized, "unauthorized", "missing admin bearer token")
			c.Abort()
			return
		}

		claims, ok := adminsession.Validate(secret, token)
		if !ok {
			apiresponse.Error(c, http.StatusUnauthorized, "unauthorized", "invalid admin bearer token")
			c.Abort()
			return
		}

		c.Set("admin_user_id", claims.UserID)
		c.Set("admin_email", claims.Email)
		c.Set("admin_display_name", claims.DisplayName)
		c.Next()
	}
}
