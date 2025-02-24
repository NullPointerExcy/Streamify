package org.spdfm.vod_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class VodBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(VodBackendApplication.class, args);
	}

}
