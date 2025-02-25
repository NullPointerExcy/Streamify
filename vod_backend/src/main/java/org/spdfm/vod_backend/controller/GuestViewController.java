package org.spdfm.vod_backend.controller;


import org.spdfm.vod_backend.models.GuestView;
import org.spdfm.vod_backend.services.GuestViewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/guest-views")
public class GuestViewController {

    @Autowired
    private GuestViewService guestViewService;

    @GetMapping
    public List<GuestView> getAllGuestViews() {
        return guestViewService.findAll();
    }

}
