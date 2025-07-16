package com.research_assistant;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/research")
@CrossOrigin(origins="*")
@AllArgsConstructor
public class ResearchController {


    public ResearchController(ResearchService researchService) {
        this.researchService = researchService;
    }

    private final ResearchService researchService;


    @PostMapping("/process")
    public ResponseEntity<String> processContent(@RequestBody ResearchRequest request){
       String result = researchService.processContent(request);

        return ResponseEntity.ok(result);
    }


}
