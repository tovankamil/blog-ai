package article

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mdtsk/blog/apps/api/internal/platform/apiresponse"
	"github.com/mdtsk/blog/apps/api/internal/store"
)

func ListPublished(c *gin.Context) {
	articles := store.Default.ListPublishedArticles()

	apiresponse.OK(c, http.StatusOK, articles, gin.H{
		"page":      1,
		"page_size": len(articles),
		"total":     len(articles),
	})
}

func GetPublished(c *gin.Context) {
	article, err := store.Default.GetPublishedArticleBySlug(c.Param("slug"))
	if err != nil {
		apiresponse.Error(c, http.StatusNotFound, "not_found", "published article not found")
		return
	}

	apiresponse.OK(c, http.StatusOK, article, nil)
}

func SearchPublished(c *gin.Context) {
	articles := store.Default.SearchPublishedArticles(c.Query("q"))

	apiresponse.OK(c, http.StatusOK, articles, gin.H{
		"page":      1,
		"page_size": len(articles),
		"total":     len(articles),
		"query":     c.Query("q"),
	})
}
