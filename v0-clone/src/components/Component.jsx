import { useEffect, useState, useRef } from "react";
import song1 from '../music/song11.mp3'
import song2 from '../music/song12.mp3'
import song3 from '../music/song13.mp3'  

function Component() {
  const [musicList, setMusicList] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const musicData = [
      { name: "Song 1", url: song1 },
      { name: "Song 2", url: song2 },
      { name: "Song 3", url: song3 },
    ];

    setMusicList(musicData);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        nextSong();
      };

      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        audioRef.current.removeEventListener("ended", handleEnded);
      };
    }
  }, [currentSongIndex]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % musicList.length);
  };

  const prevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + musicList.length) % musicList.length);
  };

  const updateCurrentTime = (e) => {
    setCurrentTime(e.target.currentTime);
    setDuration(e.target.duration);
  };

  return (
    <div className="container flex flex-col justify-center items-center">
      <div className="player-container">
        {musicList.length > 0 && (
          <audio 
            ref={audioRef}
            src={musicList[currentSongIndex]?.url} 
            onTimeUpdate={updateCurrentTime} 
          />
        )}

        <div className="controls">
          <button className="btn" onClick={prevSong}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button className="btn" onClick={togglePlayPause}>
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>

          <button className="btn" onClick={nextSong}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${(currentTime / duration) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}

export default Component;
