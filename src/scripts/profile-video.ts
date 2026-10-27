// Profile video module - handles looping video playback with IntersectionObserver

const profileVideo = document.querySelector<HTMLVideoElement>('.portrait-video');

if (profileVideo) {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const portraitFrame = profileVideo.closest<HTMLElement>('.portrait-frame');
  let videoVisible = !('IntersectionObserver' in window);

  const syncProfileVideo = (): void => {
    if (motionPreference.matches || !videoVisible) {
      profileVideo.pause();
      portraitFrame?.classList.remove('is-playing');
      return;
    }
    try {
      profileVideo.play()?.catch(() => portraitFrame?.classList.remove('is-playing'));
    } catch {
      portraitFrame?.classList.remove('is-playing');
    }
  };

  profileVideo.addEventListener('playing', () => portraitFrame?.classList.add('is-playing'));
  profileVideo.addEventListener('pause', () => portraitFrame?.classList.remove('is-playing'));

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(
      ([entry]) => {
        videoVisible = entry.isIntersecting && entry.intersectionRatio >= 0.05;
        syncProfileVideo();
      },
      { threshold: 0.05 }
    );
    videoObserver.observe(profileVideo);
  } else {
    syncProfileVideo();
  }
  motionPreference.addEventListener('change', syncProfileVideo);
}