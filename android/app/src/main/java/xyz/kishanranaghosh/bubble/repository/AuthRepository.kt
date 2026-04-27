package xyz.kishanranaghosh.bubble.repository

import xyz.kishanranaghosh.bubble.presentation.auth.GoogleAuthRequest
import xyz.kishanranaghosh.bubble.network.RetrofitClient
import xyz.kishanranaghosh.bubble.presentation.auth.ApiResponse
import xyz.kishanranaghosh.bubble.presentation.auth.AuthResponse

class AuthRepository {
    suspend fun loginWithGoogle(token: String): ApiResponse<AuthResponse> {
        return RetrofitClient.api.googleAuth(GoogleAuthRequest(token))
    }
}