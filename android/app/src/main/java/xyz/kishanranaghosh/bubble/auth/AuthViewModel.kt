package xyz.kishanranaghosh.bubble.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch
import xyz.kishanranaghosh.bubble.repository.AuthRepository

class AuthViewModel: ViewModel() {
    private val repo = AuthRepository()
    var loading by mutableStateOf(false)
    var success by mutableStateOf(false)
    var errorMessage by mutableStateOf<String?>(null)
        private set

    fun setError(message: String?) {
        errorMessage = message
    }

    fun handleGoogleToken(idToken:String) {
        viewModelScope.launch {
            loading = true
            try {
                repo.loginWithGoogle(idToken)
                success = true
            } catch(e:Exception) {
                errorMessage = e.message
            }
            loading = false
        }
    }
}