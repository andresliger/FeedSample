import { Component, ElementRef, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import data from './../../assets/feed.json';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChildren('player') videoPlayers: QueryList<any>;
  @ViewChild('stickyplayer', { static: false }) stickyPlayer: ElementRef;

  feed = data;
  currentPlaying: HTMLVideoElement = null;
  stickyVideo: HTMLVideoElement = null;
  stickyPlaying = false;

  constructor(private renderer: Renderer2) {}

  didScroll() {
    if (this.currentPlaying && this.isElementInViewport(this.currentPlaying)) {
    return;
    } else if (this.currentPlaying && !this.isElementInViewport(this.currentPlaying)) {
    // Item is out of view, pause it
    this.currentPlaying.pause();
    this.currentPlaying = null;
    }

    this.videoPlayers.forEach(player => {
    if (this.currentPlaying) {
    // Skip all furhter players, we are already playing
    return;
    }

    // Check if the element is in our view
    const nativeElement = player.nativeElement;
    const inView = this.isElementInViewport(nativeElement);

    // Prevent playing the current sticky video in the feed
    if (this.stickyVideo && this.stickyVideo.src === nativeElement.src) {
    return;
    }

    console.log("This is my sample");

    // Start autoplay if it's in the view
    if (inView) {
    this.currentPlaying = nativeElement;
    this.currentPlaying.muted = true;
    this.currentPlaying.play();
    return;
    }
    });
    }

    // https://stackoverflow.com/questions/27427023/html5-video-fullscreen-onclick
    openFullscreen(elem) {
      if (elem.requestFullscreen) {
      elem.requestFullscreen();
      } else if (elem.webkitEnterFullscreen) {
      elem.webkitEnterFullscreen();
      elem.enterFullscreen();
      }
    }

    // Check if the element is visible in the view
    isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    playOnSide(elem) {
      if (this.stickyVideo) {
        // Remove the current active video first
        this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
      }

      // Make a clone of the elemnt in our feed
      this.stickyVideo = elem.cloneNode(true);

      // Append the clone to the sticky div
      this.renderer.appendChild(this.stickyPlayer.nativeElement, this.stickyVideo);

      // Pause the feed video and get the time
      if (this.currentPlaying) {
        const playPosition = this.currentPlaying.currentTime;
        this.currentPlaying.pause();
        this.currentPlaying = null;
        this.stickyVideo.currentTime = playPosition;
      }

      // Start our sticky video
      this.stickyVideo.muted = false;
      this.stickyVideo.play();
      this.stickyPlaying = true;
    }

    closeSticky() {
      if (this.stickyVideo) {
        this.renderer.removeChild(this.stickyPlayer.nativeElement, this.stickyVideo);
        this.stickyVideo = null;
        this.stickyPlaying = false;
      }
    }

    playOrPauseSticky() {
      if (this.stickyPlaying) {
        this.stickyVideo.pause();
        this.stickyPlaying = false;
      } else {
        this.stickyVideo.play();
        this.stickyPlaying = true;
      }
    }

}


