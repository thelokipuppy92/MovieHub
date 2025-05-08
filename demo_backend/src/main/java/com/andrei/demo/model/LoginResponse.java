/*
package com.andrei.demo.model;


public record LoginResponse(
        Boolean success,
        String personId,
        String role,
        String errorMessage

) {
}


 */
package com.andrei.demo.model;


public record LoginResponse(
        Boolean success,
        String personId,
        String role,
        String token,
        String errorMessage
) {
    // Failure response
    public LoginResponse(String errorMessage){
        this(false, null, null, null, errorMessage);
    }

    // Success response
    public LoginResponse(boolean success, String personId, String role, String token){
        this(success, personId, role, token, null);
    }
}
