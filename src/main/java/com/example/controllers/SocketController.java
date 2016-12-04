package com.example.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
public class SocketController {

/*    @Autowired
    public SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/connect")
    public void testSocket() throws Exception {
        messagingTemplate.convertAndSend("/socket/answer", "Start!");
        for (int i = 0; i < 10; i++) {
            Thread.sleep(3000); // simulated delay
            messagingTemplate.convertAndSend("/socket/answer", String.format("Message #%s", i));
        }
        messagingTemplate.convertAndSend("/socket/answer", "End!");
    }*/

}
