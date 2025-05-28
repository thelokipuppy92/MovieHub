package com.andrei.demo.service;

import com.andrei.demo.controller.MovieReleaseObserver;
import com.andrei.demo.model.MailBody;
import com.andrei.demo.model.Movie;
import com.andrei.demo.model.Person;
import com.andrei.demo.model.Watchlist;
import com.andrei.demo.repository.WatchlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserNotificationService implements MovieReleaseObserver {

    private final WatchlistRepository watchlistRepository;
    private final EmailService emailService;

    public UserNotificationService(WatchlistRepository watchlistRepository, EmailService emailService) {
        this.watchlistRepository = watchlistRepository;
        this.emailService = emailService;
    }

    @Override
    public void notifyRelease(Movie movie) {
        System.out.println("[DEBUG] notifyRelease called for movie: " + movie.getTitle());

        // Find all watchlist entries for this movie
        List<Watchlist> watchlistEntries = watchlistRepository.findByMovie(movie);
        System.out.println("[DEBUG] Found " + watchlistEntries.size() + " watchlist entries for movie: " + movie.getTitle());

        for (Watchlist entry : watchlistEntries) {
            Person user = entry.getPerson();
            System.out.println("[DEBUG] Sending email to user: " + user.getEmail());

            MailBody mailBody = MailBody.builder()
                    .to(user.getEmail())
                    .subject("Movie Released: " + movie.getTitle())
                    .text("Hello " + user.getName() + ",\n\n" +
                            "The movie \"" + movie.getTitle() + "\" that you added to your watchlist has been released!\n" +
                            "Enjoy watching!\n\nBest regards,\nMovie App Team")
                    .build();

            emailService.sendSimpleMessage(mailBody);
            System.out.println("[DEBUG] Email sent to: " + user.getEmail());
        }
    }

}
