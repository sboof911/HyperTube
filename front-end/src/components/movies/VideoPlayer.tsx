import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward, SkipBack, Subtitles } from 'lucide-react';

interface Subtitle {
  code: string;
  language: string;
  url: string;
}

interface VideoPlayerProps {
  videoSrc: string;
  posterSrc?: string;
  subtitles?: Subtitle[];
}

const VideoPlayer = ({ videoSrc, posterSrc, subtitles = [] }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const hideControlsTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-select subtitle based on user language
  useEffect(() => {
    const matchedSubtitle = subtitles.find(sub => sub.code.startsWith(language));
    if (matchedSubtitle) {
      setSelectedSubtitle(matchedSubtitle.code);
    } else if (subtitles.length > 0) {
      setSelectedSubtitle(subtitles[0].code);
    }
  }, [language, subtitles]);

  // Set up video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const onDurationChange = () => {
      setDuration(video.duration);
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const onWaiting = () => {
      setIsBuffering(true);
    };

    const onCanPlay = () => {
      setIsBuffering(false);
    };

    const onLoadedData = () => {
      setIsLoaded(true);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('loadeddata', onLoadedData);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('loadeddata', onLoadedData);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
      
      if (isPlaying) {
        hideControlsTimer.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const player = playerRef.current;
    if (player) {
      player.addEventListener('mousemove', handleMouseMove);
      player.addEventListener('touchstart', handleMouseMove, { passive: true });
    }

    return () => {
      if (player) {
        player.removeEventListener('mousemove', handleMouseMove);
        player.removeEventListener('touchstart', handleMouseMove);
      }
      
      if (hideControlsTimer.current) {
        clearTimeout(hideControlsTimer.current);
      }
    };
  }, [isPlaying]);

  // Fullscreen change detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    
    if (newVolume === 0) {
      video.muted = true;
    } else if (video.muted) {
      video.muted = false;
    }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progress = progressRef.current;
    if (!video || !progress) return;

    const rect = progress.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;

    if (!document.fullscreenElement) {
      player.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const selectSubtitle = (code: string | null) => {
    setSelectedSubtitle(code);
    
    const tracks = videoRef.current?.textTracks;
    if (tracks) {
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        track.mode = track.label === code ? 'showing' : 'hidden';
      }
    }
  };

  return (
    <div 
      ref={playerRef}
      className="relative rounded-lg overflow-hidden bg-black aspect-video"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        className="w-full h-full"
        onClick={togglePlay}
        playsInline
      >
        {subtitles.map(subtitle => (
          <track
            key={subtitle.code}
            kind="subtitles"
            src={subtitle.url}
            srcLang={subtitle.code}
            label={subtitle.code}
            default={subtitle.code === selectedSubtitle}
          />
        ))}
      </video>
      
      {/* Buffering indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-red-600 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Video controls overlay */}
      <div 
        className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/70 via-transparent to-black/40 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Center play/pause button for mobile */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button 
            className={`p-4 rounded-full bg-red-600/80 text-white transition-opacity duration-300 ${
              !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            <Play size={24} className={isPlaying ? 'hidden' : 'block'} />
          </button>
        </div>
        
        {/* Top controls */}
        <div className="p-4 flex items-center justify-between">
          <div className="text-white font-medium text-shadow">
            {/* Video title could go here */}
          </div>
        </div>
        
        {/* Bottom controls */}
        <div className="p-4 space-y-2">
          {/* Progress bar */}
          <div
            ref={progressRef}
            className="relative h-1 bg-gray-600/50 rounded cursor-pointer group"
            onClick={seek}
          >
            <div
              className="absolute top-0 left-0 h-full bg-red-600 rounded"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
            <div 
              className="absolute top-0 left-0 h-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full transform translate-x-1/2"></div>
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-red-500 transition-colors focus:outline-none"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              
              <button
                onClick={skipBackward}
                className="text-white hover:text-red-500 transition-colors focus:outline-none hidden sm:block"
                aria-label="Skip back 10 seconds"
              >
                <SkipBack size={20} />
              </button>
              
              <button
                onClick={skipForward}
                className="text-white hover:text-red-500 transition-colors focus:outline-none hidden sm:block"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward size={20} />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-red-500 transition-colors focus:outline-none"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                
                <div className="w-16 hidden sm:block">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={changeVolume}
                    className="w-full accent-red-600"
                  />
                </div>
              </div>
              
              <div className="text-sm text-white hidden sm:block">
                <span>{formatTime(currentTime)}</span>
                <span> / </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {subtitles && subtitles.length > 0 && (
                <div className="relative group">
                  <button
                    className="text-white hover:text-red-500 transition-colors focus:outline-none"
                    aria-label="Subtitles"
                  >
                    <Subtitles size={20} />
                  </button>
                  
                  <div className="absolute right-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all bg-gray-900 rounded shadow-lg p-2 w-36">
                    <div className="text-sm text-white mb-1 font-medium">Subtitles</div>
                    <div className="space-y-1">
                      <button
                        onClick={() => selectSubtitle(null)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded ${
                          selectedSubtitle === null ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                        }`}
                      >
                        Off
                      </button>
                      
                      {subtitles.map(subtitle => (
                        <button
                          key={subtitle.code}
                          onClick={() => selectSubtitle(subtitle.code)}
                          className={`block w-full text-left px-2 py-1 text-sm rounded ${
                            selectedSubtitle === subtitle.code ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          {subtitle.language}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-red-500 transition-colors focus:outline-none"
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;