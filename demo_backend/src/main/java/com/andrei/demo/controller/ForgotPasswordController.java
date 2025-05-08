package com.andrei.demo.controller;

import com.andrei.demo.config.EmailNotFoundException;

import com.andrei.demo.model.ForgotPassword;
import com.andrei.demo.model.MailBody;
import com.andrei.demo.model.Person;
import com.andrei.demo.repository.ForgotPasswordRepository;
import com.andrei.demo.repository.PersonRepository;
import com.andrei.demo.service.EmailService;
import com.andrei.demo.util.ChangePassword;
import com.andrei.demo.util.PasswordUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.time.Instant;
import java.util.Calendar;
import java.util.Objects;
import java.util.Random;

@CrossOrigin
@RestController
@RequestMapping("/forgotPassword")
public class ForgotPasswordController {

    private final PersonRepository personRepository;
    private final EmailService emailService;
    private final ForgotPasswordRepository forgotPasswordRepository;

     private final PasswordUtil passwordUtil;

    public ForgotPasswordController(PersonRepository personRepository, EmailService emailService, ForgotPasswordRepository forgotPasswordRepository, PasswordUtil passwordUtil) {
        this.personRepository = personRepository;
        this.emailService = emailService;
        this.forgotPasswordRepository = forgotPasswordRepository;
        this.passwordUtil = passwordUtil;
    }


    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("Please provide a valid email"));

        ForgotPassword existingOtp = forgotPasswordRepository.findByPerson(person);

        if (existingOtp != null) {
            if (existingOtp.getExpireDate().before(java.sql.Timestamp.from(Instant.now()))) {

                // OTP has expired, generate and save a new one
                int otp = otpGenerator();
                existingOtp.setOtp(otp);
                existingOtp.setExpireDate(new Date(System.currentTimeMillis() + 70 * 1000));

                forgotPasswordRepository.save(existingOtp);

                MailBody mailBody = MailBody.builder()
                        .to(email)
                        .text("This is the OTP for your Forgot Password request: " + otp)
                        .subject("OTP for Forgot Password request")
                        .build();
                emailService.sendSimpleMessage(mailBody);

                return ResponseEntity.ok("New OTP sent to your email");
            } else {
                // OTP is still valid
                return new ResponseEntity<>("You already have a valid OTP. Please check your email.", HttpStatus.CONFLICT);
            }
        } else {
            // No existing OTP found, generate a new one
            int otp = otpGenerator();

            if (person.getId() == null) {
                personRepository.save(person);  // Save person if not already saved
            }

            ForgotPassword fp = ForgotPassword.builder()
                    .otp(otp)
                    .expireDate(new Date(System.currentTimeMillis() + 70 * 1000))
                    .person(person)
                    .build();
            forgotPasswordRepository.save(fp); // Save the new OTP


            MailBody mailBody = MailBody.builder()
                    .to(email)
                    .text("This is the OTP for your Forgot Password request: " + otp)
                    .subject("OTP for Forgot Password request")
                    .build();
            emailService.sendSimpleMessage(mailBody);

            return ResponseEntity.ok("OTP sent to your email");
        }
    }


    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<String> verifyOTP(@PathVariable Integer otp, @PathVariable String email){
        Person person = personRepository.findByEmail(email)
                .orElseThrow(() -> new EmailNotFoundException("Please provide a valid email"));

         ForgotPassword fp = forgotPasswordRepository.findByOtpAndPerson(otp, person).orElseThrow(() -> new RuntimeException("Invalid OTP for email:" + email));

         if(fp.getExpireDate().before(Date.from(Instant.now()))){
             forgotPasswordRepository.deleteById(fp.getFpid());
             return  new ResponseEntity<>("OTP has expired!", HttpStatus.EXPECTATION_FAILED);
         }
         return ResponseEntity.ok("OTP verified!");

    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePassword changePassword,
                                                        @PathVariable String email){
        if(!Objects.equals(changePassword.password(), changePassword.repeatPassword())){
            return new ResponseEntity<>("Please enter the password again", HttpStatus.EXPECTATION_FAILED);
        }
        String  encodedPassword = passwordUtil.hashPassword(changePassword.password());
        personRepository.updatePassword(email, encodedPassword);

        return ResponseEntity.ok("Password has been changed");
    }

    private Integer otpGenerator(){
        Random random = new Random();
        return random.nextInt(100_000, 999_999);
    }

}
