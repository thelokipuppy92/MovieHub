package com.andrei.demo.controller;

import com.andrei.demo.model.Movie;

public interface MovieReleaseObserver {
    void notifyRelease(Movie movie);
}
