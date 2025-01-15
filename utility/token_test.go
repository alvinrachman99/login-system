package utility

import (
	"log"
	"testing"

	"github.com/google/uuid"
	"github.com/stretchr/testify/require"
)

func TestToken(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		publicId := uuid.New()
		tokenString, err := GenerateToken(publicId.String(), "mysecret")
		require.Nil(t, err)
		require.NotEmpty(t, tokenString)
		log.Println(tokenString)
	})
}

func TestVerifyToken(t *testing.T) {
	t.Run("success", func(t *testing.T) {
		publicId := uuid.New()
		tokenString, err := GenerateToken(publicId.String(), "mysecret")
		require.Nil(t, err)
		require.NotEmpty(t, tokenString)

		claims, err := VerifyToken(tokenString, "mysecret")
		require.Nil(t, err)
		require.NotEmpty(t, claims)

		log.Println(claims)
	})
}
