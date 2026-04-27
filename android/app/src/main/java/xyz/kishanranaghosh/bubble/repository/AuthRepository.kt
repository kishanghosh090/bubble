package xyz.kishanranaghosh.bubble.repository

import xyz.kishanranaghosh.bubble.auth.GoogleAuthRequest
import xyz.kishanranaghosh.bubble.network.RetrofitClient

class AuthRepository {
    suspend fun loginWithGoogle(token:String) =
        RetrofitClient.api.googleAuth(GoogleAuthRequest(token))
}