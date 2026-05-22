package admin

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/mdtsk/blog/apps/api/internal/platform/adminsession"
	"github.com/mdtsk/blog/apps/api/internal/platform/apiresponse"
	"github.com/mdtsk/blog/apps/api/internal/store"
)

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	User  store.AdminUser `json:"user"`
	Token string          `json:"token"`
}

func Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid login payload")
		return
	}

	user, err := store.Default.AuthenticateAdmin(input.Email, input.Password)
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound), errors.Is(err, store.ErrValidation):
			apiresponse.Error(c, http.StatusUnauthorized, "invalid_credentials", "invalid email or password")
		default:
			apiresponse.Error(c, http.StatusInternalServerError, "internal_error", "could not authenticate admin")
		}
		return
	}

	secretValue, ok := c.Get("admin_session_secret")
	secret, _ := secretValue.(string)
	if !ok || secret == "" {
		apiresponse.Error(c, http.StatusServiceUnavailable, "admin_auth_not_configured", "admin session secret is not configured")
		return
	}
	token, err := adminsession.Issue(secret, user.ID, user.Email, user.DisplayName)
	if err != nil {
		apiresponse.Error(c, http.StatusInternalServerError, "internal_error", "could not create admin session token")
		return
	}

	apiresponse.OK(c, http.StatusOK, LoginResponse{
		User:  user,
		Token: token,
	}, nil)
}

func Overview(c *gin.Context) {
	articles := store.Default.ListAllArticles()
	jobs := store.Default.ListJobs()
	sources := store.Default.ListSources()

	apiresponse.OK(c, http.StatusOK, gin.H{
		"message": "admin API ready",
		"counts": gin.H{
			"articles": len(articles),
			"jobs":     len(jobs),
			"sources":  len(sources),
		},
	}, nil)
}

func ListArticles(c *gin.Context) {
	apiresponse.OK(c, http.StatusOK, store.Default.ListAllArticles(), nil)
}

func GetArticle(c *gin.Context) {
	detail, err := store.Default.GetAdminArticleDetail(c.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			apiresponse.Error(c, http.StatusNotFound, "not_found", "article not found")
		case errors.Is(err, store.ErrValidation):
			apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid article id")
		default:
			apiresponse.Error(c, http.StatusInternalServerError, "internal_error", "could not load article detail")
		}
		return
	}

	apiresponse.OK(c, http.StatusOK, detail, nil)
}

func CreateArticle(c *gin.Context) {
	var input store.CreateArticleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid article payload")
		return
	}

	article, err := store.Default.CreateArticle(input)
	if err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "title, slug, meta description, and a valid category_slug are required")
		return
	}

	apiresponse.OK(c, http.StatusCreated, article, nil)
}

func UpdateArticle(c *gin.Context) {
	var input store.UpdateArticleInput
	if err := c.ShouldBindJSON(&input); err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid article payload")
		return
	}

	article, err := store.Default.UpdateArticle(c.Param("id"), input)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			apiresponse.Error(c, http.StatusNotFound, "not_found", "article not found")
			return
		}

		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "could not update article")
		return
	}

	apiresponse.OK(c, http.StatusOK, article, nil)
}

func AttachSourceRecord(c *gin.Context) {
	var input store.AttachSourceRecordInput
	if err := c.ShouldBindJSON(&input); err != nil {
		apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid source record payload")
		return
	}

	if err := store.Default.AttachSourceRecord(c.Param("id"), input); err != nil {
		switch {
		case errors.Is(err, store.ErrValidation):
			apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid article id or source record id")
		case errors.Is(err, store.ErrNotFound):
			apiresponse.Error(c, http.StatusNotFound, "not_found", "article or source record not found")
		default:
			apiresponse.Error(c, http.StatusInternalServerError, "internal_error", "could not attach source record")
		}
		return
	}

	apiresponse.OK(c, http.StatusOK, gin.H{"message": "source record attached"}, nil)
}

func DetachSourceRecord(c *gin.Context) {
	if err := store.Default.DetachSourceRecord(c.Param("id"), c.Param("sourceRecordID")); err != nil {
		switch {
		case errors.Is(err, store.ErrValidation):
			apiresponse.Error(c, http.StatusBadRequest, "validation_error", "invalid article id or source record id")
		case errors.Is(err, store.ErrNotFound):
			apiresponse.Error(c, http.StatusNotFound, "not_found", "source record link not found")
		default:
			apiresponse.Error(c, http.StatusInternalServerError, "internal_error", "could not detach source record")
		}
		return
	}

	apiresponse.OK(c, http.StatusOK, gin.H{"message": "source record detached"}, nil)
}

func GenerateDraft(c *gin.Context) {
	job, err := store.Default.EnqueueGenerateDraftJob(c.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			apiresponse.Error(c, http.StatusNotFound, "not_found", "article not found")
		case errors.Is(err, store.ErrPrecondition):
			apiresponse.Error(c, http.StatusConflict, "precondition_failed", "source pack is required before generating a draft")
		default:
			apiresponse.Error(c, http.StatusInternalServerError, "internal_error", "could not enqueue generate draft job")
		}
		return
	}

	apiresponse.OK(c, http.StatusAccepted, job, nil)
}

func RunPlagiarismCheck(c *gin.Context) {
	job, err := store.Default.EnqueuePlagiarismCheckJob(c.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			apiresponse.Error(c, http.StatusNotFound, "not_found", "article not found")
		case errors.Is(err, store.ErrPrecondition):
			apiresponse.Error(c, http.StatusConflict, "precondition_failed", "source pack and at least one revision are required before plagiarism check")
		default:
			apiresponse.Error(c, http.StatusInternalServerError, "internal_error", "could not enqueue plagiarism check job")
		}
		return
	}

	apiresponse.OK(c, http.StatusAccepted, job, nil)
}

func PublishArticle(c *gin.Context) {
	article, err := store.Default.PublishArticle(c.Param("id"))
	if err != nil {
		switch {
		case errors.Is(err, store.ErrNotFound):
			apiresponse.Error(c, http.StatusNotFound, "not_found", "article not found")
		case errors.Is(err, store.ErrPublishGateFailed):
			apiresponse.Error(c, http.StatusConflict, "publish_gate_failed", "article is missing required metadata or a passing plagiarism check")
		default:
			apiresponse.Error(c, http.StatusBadRequest, "publish_failed", "could not publish article")
		}
		return
	}

	apiresponse.OK(c, http.StatusAccepted, article, nil)
}

func ScheduleArticle(c *gin.Context) {
	article, err := store.Default.ScheduleArticle(c.Param("id"))
	if err != nil {
		apiresponse.Error(c, http.StatusNotFound, "not_found", "article not found")
		return
	}

	apiresponse.OK(c, http.StatusAccepted, article, nil)
}

func ListJobs(c *gin.Context) {
	apiresponse.OK(c, http.StatusOK, store.Default.ListJobs(), nil)
}
