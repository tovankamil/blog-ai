package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mdtsk/blog/apps/api/internal/admin"
	"github.com/mdtsk/blog/apps/api/internal/article"
	"github.com/mdtsk/blog/apps/api/internal/category"
	"github.com/mdtsk/blog/apps/api/internal/platform/apiresponse"
	"github.com/mdtsk/blog/apps/api/internal/platform/config"
	"github.com/mdtsk/blog/apps/api/internal/sources"
)

func NewRouter(cfg config.Config) *gin.Engine {
	if cfg.AppEnv == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := gin.New()
	router.Use(gin.Logger(), gin.Recovery())

	router.GET("/healthz", func(c *gin.Context) {
		apiresponse.OK(c, http.StatusOK, gin.H{
			"status": "ok",
			"env":    cfg.AppEnv,
		}, nil)
	})

	router.Use(func(c *gin.Context) {
		c.Set("admin_session_secret", cfg.AdminSessionSecret)
		c.Next()
	})

	router.POST("/api/admin/login", admin.Login)

	api := router.Group("/api")
	{
		api.GET("/articles", article.ListPublished)
		api.GET("/articles/:slug", article.GetPublished)
		api.GET("/categories", category.List)
		api.GET("/categories/:slug/articles", category.ListArticlesByCategory)
		api.GET("/search", article.SearchPublished)
	}

	adminGroup := router.Group("/api/admin")
	adminGroup.Use(requireAdminSession(cfg.AdminSessionSecret))
	{
		adminGroup.GET("", admin.Overview)
		adminGroup.GET("/articles", admin.ListArticles)
		adminGroup.GET("/articles/:id", admin.GetArticle)
		adminGroup.POST("/articles", admin.CreateArticle)
		adminGroup.PUT("/articles/:id", admin.UpdateArticle)
		adminGroup.POST("/articles/:id/source-records", admin.AttachSourceRecord)
		adminGroup.DELETE("/articles/:id/source-records/:sourceRecordID", admin.DetachSourceRecord)
		adminGroup.POST("/articles/:id/generate-draft", admin.GenerateDraft)
		adminGroup.POST("/articles/:id/plagiarism-check", admin.RunPlagiarismCheck)
		adminGroup.POST("/articles/:id/publish", admin.PublishArticle)
		adminGroup.POST("/articles/:id/schedule", admin.ScheduleArticle)
		adminGroup.GET("/jobs", admin.ListJobs)
		adminGroup.GET("/trends", sources.ListTrendCandidates)
		adminGroup.GET("/sources", sources.ListSources)
		adminGroup.GET("/source-records", sources.ListSourceRecords)
		adminGroup.POST("/sources", sources.CreateSource)
		adminGroup.PUT("/sources/:id", sources.UpdateSource)
	}

	return router
}
