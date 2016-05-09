package com.example.controllers;

import com.example.domain.HttpEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@RestController
@RequestMapping("rest")
public class WebRestController {

    @RequestMapping
    public HttpEntity<String> testRest() {
        HttpEntity<String> entity = new HttpEntity<>();
        entity.setResult("Controller Response");
        return entity;
    }

    @RequestMapping("data")
    public byte[] getData() throws IOException {
        return Files.readAllBytes(Paths.get(this.getClass().getClassLoader().getResource("data/data.csv").getPath()));
    }

}
