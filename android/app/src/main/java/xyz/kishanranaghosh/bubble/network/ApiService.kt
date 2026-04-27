package xyz.kishanranaghosh.bubble.network

import retrofit2.http.Body
import retrofit2.http.POST
import xyz.kishanranaghosh.bubble.auth.AuthResponse
import xyz.kishanranaghosh.bubble.auth.GoogleAuthRequest

interface ApiService {
    @POST("api/v1/auth/google")
    suspend fun googleAuth(@Body body: GoogleAuthRequest): AuthResponse
}

