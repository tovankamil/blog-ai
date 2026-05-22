package adminsession

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"time"
)

const TTL = 8 * time.Hour

type Claims struct {
	UserID      string `json:"user_id"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
	ExpiresAt   int64  `json:"expires_at"`
}

func Issue(secret, userID, email, displayName string) (string, error) {
	claims := Claims{
		UserID:      userID,
		Email:       email,
		DisplayName: displayName,
		ExpiresAt:   time.Now().Add(TTL).Unix(),
	}

	body, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}

	encoded := base64.RawURLEncoding.EncodeToString(body)
	signature := sign(secret, encoded)
	return encoded + "." + signature, nil
}

func Validate(secret, token string) (Claims, bool) {
	parts := splitToken(token)
	if len(parts) != 2 {
		return Claims{}, false
	}

	body, signature := parts[0], parts[1]
	expected := sign(secret, body)
	if subtle.ConstantTimeCompare([]byte(signature), []byte(expected)) != 1 {
		return Claims{}, false
	}

	raw, err := base64.RawURLEncoding.DecodeString(body)
	if err != nil {
		return Claims{}, false
	}

	var claims Claims
	if err := json.Unmarshal(raw, &claims); err != nil {
		return Claims{}, false
	}
	if claims.UserID == "" || claims.Email == "" || claims.DisplayName == "" || claims.ExpiresAt <= time.Now().Unix() {
		return Claims{}, false
	}

	return claims, true
}

func sign(secret, body string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(body))
	return hex.EncodeToString(mac.Sum(nil))
}

func splitToken(token string) []string {
	for i := 0; i < len(token); i++ {
		if token[i] == '.' {
			return []string{token[:i], token[i+1:]}
		}
	}
	return nil
}
