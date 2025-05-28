// WatchlistCreateDTO.java (optional if you want to accept a JSON body)
package com.andrei.demo.model;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Data
public class WatchlistCreateDTO {
    @NotNull
    private UUID personId;

    @NotNull
    private UUID movieId;
}
