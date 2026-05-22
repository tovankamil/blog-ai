package article

type Status string

const (
	StatusIdea             Status = "idea"
	StatusSourced          Status = "sourced"
	StatusDraft            Status = "draft"
	StatusAIAssisted       Status = "ai_assisted"
	StatusPlagiarismCheck  Status = "plagiarism_check"
	StatusReview           Status = "review"
	StatusScheduled        Status = "scheduled"
	StatusPublished        Status = "published"
	StatusArchived         Status = "archived"
)

type Article struct {
	ID              string `json:"id"`
	Title           string `json:"title"`
	Slug            string `json:"slug"`
	Excerpt         string `json:"excerpt"`
	Status          Status `json:"status"`
	CategorySlug    string `json:"category_slug"`
	MetaDescription string `json:"meta_description"`
}

