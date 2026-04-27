package xyz.kishanranaghosh.bubble.auth

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.platform.LocalContext
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import androidx.credentials.exceptions.NoCredentialException
import androidx.lifecycle.viewmodel.compose.viewModel
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import kotlinx.coroutines.launch
import xyz.kishanranaghosh.bubble.R

@Composable
fun AuthScreen(vm: AuthViewModel = viewModel()) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope ()
    val credentialManager = androidx.credentials.CredentialManager.create(context)
    val webClientId = context.getString(R.string.default_web_client_id)

    Column (
        modifier = androidx.compose.ui.Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
    ){
        Button(onClick = {
            scope.launch {
                    try {
                        val option = GetGoogleIdOption.Builder()
                            .setServerClientId(webClientId)
                            .setFilterByAuthorizedAccounts(false)
                            .build()

                        val request = GetCredentialRequest.Builder()
                            .addCredentialOption(option)
                            .build()

                        val result = credentialManager.getCredential(context, request)
                        when (val credential = result.credential) {
                            is CustomCredential -> {
                                if (credential.type == GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
                                    val google = GoogleIdTokenCredential.createFrom(credential.data)
                                    vm.handleGoogleToken(google.idToken)
                                } else {
                                    vm.setError("Unexpected credential type returned by Google sign-in.")
                                }
                            }
                            else -> vm.setError("Unexpected credential type returned by Google sign-in.")
                        }
                    } catch (_: NoCredentialException) {
                        vm.setError("No Google account or saved credential found on this device.")
                    } catch (e: Exception) {
                        vm.setError(e.message ?: "Google sign-in failed.")
                    }
            }
        }) {
            Text("Continue with Google")
        }

        if(vm.loading) Text("Loading...")
        vm.errorMessage?.let { Text(it) }
        if(vm.success) Text("Login Success")
    }
}