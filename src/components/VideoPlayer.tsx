import React from 'react'

interface VideoPlayerProps {
  url?: string
  videos?: Array<{ url: string }>
  title?: string
  description?: string
  className?: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  videos,
  title,
  description,
  className = '',
}) => {
  // Извлекаем ID видео из YouTube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Извлекаем ID видео из Rutube URL
  const getRutubeId = (url: string) => {
    const regExp = /rutube\.ru\/video\/([a-f0-9]+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  // Проверяем, является ли URL прямым видео файлом
  const isDirectVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv']
    return videoExtensions.some(ext => url.toLowerCase().includes(ext))
  }

  // Если передан массив видео, рендерим их под одним заголовком
  if (videos && videos.length > 0) {
    return (
      <div className={className}>
        {title && <h3 className="video-group-title">{title}</h3>}
        {videos.map((video, index) => {
          const youtubeId = getYouTubeId(video.url)
          const rutubeId = getRutubeId(video.url)
          const isVideo = isDirectVideo(video.url)

          return (
            <div
              key={index}
              className={`video-player-wrapper ${isVideo ? 'video-player-wrapper--adaptive' : ''}`}
            >
              {youtubeId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              ) : rutubeId ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://rutube.ru/play/embed/${rutubeId}`}
                  title="Rutube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              ) : isVideo ? (
                <video
                  width="100%"
                  height="auto"
                  controls
                  preload="metadata"
                  style={{ display: 'block' }}
                >
                  <source src={video.url} type="video/mp4" />
                  <source src={video.url} type="video/webm" />
                  <source src={video.url} type="video/ogg" />
                  Ваш браузер не поддерживает видео тег.
                </video>
              ) : (
                <div
                  style={{
                    background: '#f0f0f0',
                    padding: '20px',
                    textAlign: 'center',
                    color: '#666',
                  }}
                >
                  Неподдерживаемый формат видео
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  // Одиночное видео (старая логика)
  if (!url) {
    return null
  }

  const youtubeId = getYouTubeId(url)
  const rutubeId = getRutubeId(url)
  const isVideo = isDirectVideo(url)

  return (
    <div className={className}>
      {title && <h3 className="video-player-title">{title}</h3>}
      {description && <p className="video-player-description">{description}</p>}
      <div className={`video-player-wrapper ${isVideo ? 'video-player-wrapper--adaptive' : ''}`}>
        {youtubeId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title || 'YouTube video player'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ) : rutubeId ? (
          <iframe
            width="100%"
            height="100%"
            src={`https://rutube.ru/play/embed/${rutubeId}`}
            title={title || 'Rutube video player'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ) : isVideo ? (
          <video
            width="100%"
            height="auto"
            controls
            preload="metadata"
            style={{ display: 'block' }}
          >
            <source src={url} type="video/mp4" />
            <source src={url} type="video/webm" />
            <source src={url} type="video/ogg" />
            Ваш браузер не поддерживает видео тег.
          </video>
        ) : (
          <div
            style={{ background: '#f0f0f0', padding: '20px', textAlign: 'center', color: '#666' }}
          >
            Неподдерживаемый формат видео
          </div>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer
