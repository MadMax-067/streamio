import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import localFont from 'next/font/local'
import Card from './Card'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
const nunito = localFont({ src: '../fonts/Nunito.ttf' });

const StyledVideoCard = styled.div`
  .video-card {
    width: 100%;
    max-width: 21rem; /* Adjusted from 24rem for better container fit */
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .video-info {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.375rem 0.25rem; /* Reduced horizontal padding */
  }

  .avatar-container {
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
  }

  .text-container {
    flex: 1;
    min-width: 0; /* Helps with text truncation */
  }

  .video-title {
    font-size: clamp(0.875rem, 1.2vw, 1.125rem);
    margin: 0.25rem 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .channel-name {
    font-size: clamp(0.75rem, 1vw, 0.875rem);
    color: rgba(var(--secondary-rgb), 0.5);
  }

  .views {
    font-size: clamp(0.7rem, 0.9vw, 0.75rem);
    color: rgba(var(--secondary-rgb), 0.5);
  }

  @media (max-width: 48rem) { /* Mobile */
    .video-card {
      max-width: 100%;
      min-width: 16rem; /* Added minimum width */
    }

    .avatar-container {
      width: 2rem; /* 32px */
      height: 2rem; /* 32px */
    }
  }

  @media (min-width: 48.063rem) and (max-width: 64rem) { /* Tablet */
    .video-card {
      max-width: 19rem;
      min-width: 17rem;
    }
  }

  @media (min-width: 64.063rem) and (max-width: 85.375rem) { /* Desktop */
    .video-card {
      max-width: 21rem;
      min-width: 18rem;
    }
  }

  @media (min-width: 85.376rem) { /* Large Desktop */
    .video-card {
      max-width: 22rem;
      min-width: 20rem;
    }
  }
`;

const VideoCard = ({ videoId, title, thumbnail, channelName, views, avatar, duration }) => {
  return (
    <StyledVideoCard>
      <Link href={`/video/${videoId}`}>
        <div className={`${nunito.className} video-card gap-2 flex flex-col justify-between bg-secondary/0 rounded`}>
          <div className="relative shrink-0 w-full">
            <Card duration={duration} thumbnail={thumbnail} />
          </div>
          <div className="video-info">
            <div className="avatar-container relative rounded-full overflow-hidden">
              <Image
                src={avatar}
                alt={channelName}
                fill
                style={{ objectFit: 'cover' }}
                className="w-full h-full"
              />
            </div>
            <div className="text-container">
              <h3 className="video-title text-secondary font-semibold">{title}</h3>
              <h6 className="channel-name">{channelName}</h6>
              <h6 className="views">{views}</h6>
            </div>
          </div>
        </div>
      </Link>
    </StyledVideoCard>
  )
}

export default VideoCard
