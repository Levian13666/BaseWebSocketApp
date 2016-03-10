package com.example.controllers;

import com.example.domain.HttpEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

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
    public List<Map<String, Object>> getData() throws IOException {
        String[] names = {"test0", "test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10", "test11"};
        List<Map<String, Object>> data = new ArrayList<>();
        Random random = new Random();
        for (String name : names) {
            HashMap<String, Object> entity = new HashMap<>();
            entity.put("name", name);
            entity.put("value", random.nextInt(1000 - 100 + 1) + 100);
            data.add(entity);
        }

        return data;
    }

}
