// WatchlistResponseDTO.java
package com.andrei.demo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
public class WatchlistResponseDTO {
    private UUID id;
    private UUID personId;
    private String personName;
    private UUID movieId;
    private String movieTitle;
    private LocalDateTime addedAt;
    private boolean released;
}
