package xyz.kishanranaghosh.bubble

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import xyz.kishanranaghosh.bubble.core.SessionManager
import xyz.kishanranaghosh.bubble.navigation.Screen
import xyz.kishanranaghosh.bubble.network.RetrofitClient
import xyz.kishanranaghosh.bubble.presentation.auth.AuthScreen
import xyz.kishanranaghosh.bubble.presentation.home.HomeScreen
import xyz.kishanranaghosh.bubble.ui.theme.BubbleTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        RetrofitClient.init(applicationContext)
        enableEdgeToEdge()
        setContent {
            val context = LocalContext.current
            val session = remember { SessionManager(context) }
            val navController = rememberNavController()
            val targetRoute by produceState(initialValue = Screen.Loading.route, session) {
                session.accessTokenFlow.collect { token ->
                    value = if (token.isNullOrEmpty()) Screen.Auth.route else Screen.Home.route
                }
            }

            LaunchedEffect(targetRoute) {
                if (targetRoute != Screen.Loading.route && navController.currentDestination?.route != targetRoute) {
                    navController.navigate(targetRoute) {
                        popUpTo(Screen.Loading.route) { inclusive = true }
                        launchSingleTop = true
                    }
                }
            }

            BubbleTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = Screen.Loading.route,
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable(route = Screen.Auth.route) {
                            AuthScreen(session = session, navHostController = navController)
                        }
                        composable(
                            route = Screen.Home.route
                        ) {
                            HomeScreen()
                        }
                        composable(
                            route = Screen.Loading.route
                        ) {
                            Column(
                                modifier = Modifier.fillMaxSize(),
                                verticalArrangement = androidx.compose.foundation.layout.Arrangement.Center,
                                horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally
                            ) {
                                Text("Loading...")
                            }
                        }
                    }
                }
            }
        }

    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(
        text = "Hello $name!",
        modifier = modifier
    )
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    BubbleTheme {
        Greeting("Android")
    }
}