package apiresponse

import "github.com/gin-gonic/gin"

type ErrorPayload struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

type Response struct {
	Data  any           `json:"data"`
	Meta  any           `json:"meta"`
	Error *ErrorPayload `json:"error"`
}

func OK(c *gin.Context, status int, data any, meta any) {
	c.JSON(status, Response{
		Data:  data,
		Meta:  meta,
		Error: nil,
	})
}

func Error(c *gin.Context, status int, code, message string) {
	c.JSON(status, Response{
		Data: nil,
		Meta: nil,
		Error: &ErrorPayload{
			Code:    code,
			Message: message,
		},
	})
}
