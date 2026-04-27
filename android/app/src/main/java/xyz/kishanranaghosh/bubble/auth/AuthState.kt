package xyz.kishanranaghosh.bubble.auth

data class GoogleAuthRequest(val idToken:String)
data class AuthResponse(val accessToken:String, val refreshToken:String)