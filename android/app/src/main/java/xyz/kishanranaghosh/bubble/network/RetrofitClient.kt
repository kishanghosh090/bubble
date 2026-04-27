package xyz.kishanranaghosh.bubble.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    val api: ApiService = Retrofit
        .Builder()
        .baseUrl("http://192.168.1.3:4006/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)
}
