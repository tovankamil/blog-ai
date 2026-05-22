package sources

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mdtsk/blog/apps/api/internal/platform/apiresponse"
	"github.com/mdtsk/blog/apps/api/internal/store"
)

func ListSources(c *gin.Context) {
	apiresponse.OK(c, http.StatusOK, store.Default.ListSources(), nil)
}

func CreateSource(c *gin.Context) {
	var input store.CreateSourceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid source payload")
		return
	}

	source, err := store.Default.CreateSource(input)
	if err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "source domain and source name are required, and domain must be unique")
		return
	}

	apiresponse.OK(c, http.StatusCreated, source, nil)
}

func UpdateSource(c *gin.Context) {
	var input store.UpdateSourceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid source payload")
		return
	}

	source, err := store.Default.UpdateSource(c.Param("id"), input)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			apiresponse.Error(c, http.StatusNotFound, "not_found", "source not found")
			return
		}

		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "could not update source")
		return
	}

	apiresponse.OK(c, http.StatusOK, source, nil)
}

func ListTrendCandidates(c *gin.Context) {
	apiresponse.OK(c, http.StatusOK, store.Default.ListTrendCandidates(), nil)
}

func ListSourceRecords(c *gin.Context) {
	apiresponse.OK(c, http.StatusOK, store.Default.ListSourceRecords(), nil)
}
