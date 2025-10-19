package com.example.config;


import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@Configuration
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT"
)
@OpenAPIDefinition(
    security = { @SecurityRequirement(name = "bearerAuth") }, // 全エンドポイントに適用（個別でも可）
    	            // 必要ならローカル用も足せる：
    	            // @Server(url = "http://localhost:8080/api", description = "Local")
    servers = { @Server(url = "/api") }
		)
public class OpenApiConfig { }