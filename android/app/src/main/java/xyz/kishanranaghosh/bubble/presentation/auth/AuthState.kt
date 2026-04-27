package xyz.kishanranaghosh.bubble.presentation.auth

data class GoogleAuthRequest(val idToken: String)
data class ApiResponse<T>(
    val success: Boolean,
    val statusCode: Int,
    val message: String,
    val data: T?
)

data class AuthResponse(val accessToken: String, val refreshToken: String)