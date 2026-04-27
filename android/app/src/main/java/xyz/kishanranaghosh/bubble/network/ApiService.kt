package xyz.kishanranaghosh.bubble.network

import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query
import xyz.kishanranaghosh.bubble.presentation.auth.ApiResponse
import xyz.kishanranaghosh.bubble.presentation.auth.AuthResponse
import xyz.kishanranaghosh.bubble.presentation.auth.GoogleAuthRequest

interface ApiService {
    @POST("api/v1/auth/google")
    suspend fun googleAuth(@Body body: GoogleAuthRequest): ApiResponse<AuthResponse>

    @GET("api/v1/users/search/?q=example")
    suspend fun searchUsers(
        @Query("q") query: String
    ): ApiResponse<String>
}

