package com.andrei.demo.service;

import com.andrei.demo.controller.MovieReleaseObserver;
import com.andrei.demo.model.Movie;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MoviePublisher {
    private final List<MovieReleaseObserver> observers = new ArrayList<>();

    public void addObserver(MovieReleaseObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(MovieReleaseObserver observer) {
        observers.remove(observer);
    }

    public void notifyObservers(Movie movie) {
        for (MovieReleaseObserver observer : observers) {
            observer.notifyRelease(movie);
        }
    }
}
