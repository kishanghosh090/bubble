package xyz.kishanranaghosh.bubble.presentation.auth

import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import xyz.kishanranaghosh.bubble.repository.AuthRepository

class AuthViewModel : ViewModel() {
    private val repo = AuthRepository()
    var loading by mutableStateOf(false)
    var success by mutableStateOf(false)
    var errorMessage by mutableStateOf<String?>(null)
        private set

    fun setError(message: String?) {
        errorMessage = message
    }

    fun handleGoogleToken(idToken: String) {
        viewModelScope.launch {
            loading = true
            errorMessage = null
            try {
                val res = repo.loginWithGoogle(idToken)
                if (res.success && res.data != null) {
                    Log.d(
                        "AuthViewModel",
                        "Received tokens: access=${res.data.accessToken}, refresh=${res.data.refreshToken}"
                    )
                    success = true
                } else {
                    success = false
                    errorMessage = res.message
                }
            } catch (e: Exception) {
                success = false
                errorMessage = e.message
            }
            loading = false
        }
    }
}