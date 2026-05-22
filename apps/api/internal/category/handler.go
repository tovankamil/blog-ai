package category

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mdtsk/blog/apps/api/internal/platform/apiresponse"
	"github.com/mdtsk/blog/apps/api/internal/store"
)

func List(c *gin.Context) {
	apiresponse.OK(c, http.StatusOK, store.Default.ListCategories(), nil)
}

func ListArticlesByCategory(c *gin.Context) {
	articles, err := store.Default.ListPublishedArticlesByCategory(c.Param("slug"))
	if err != nil {
		apiresponse.Error(c, http.StatusNotFound, "not_found", "category not found")
		return
	}

	apiresponse.OK(c, http.StatusOK, articles, gin.H{
		"page":      1,
		"page_size": len(articles),
		"total":     len(articles),
		"category":  c.Param("slug"),
	})
}
