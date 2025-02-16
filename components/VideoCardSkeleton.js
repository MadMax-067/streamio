"use client"
import React from 'react'
import styled from 'styled-components'

const StyledVideoCardSkeleton = styled.div`
  .video-card {
    width: 100%;
    max-width: 21rem;
    transition: all 0.3s ease;
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 25%,
      rgba(255, 255, 255, 0.1) 37%,
      rgba(255, 255, 255, 0.05) 63%
    );
    background-size: 400% 100%;
    animation: skeleton-loading 1.4s ease infinite;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }

  .video-info {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.375rem 0.25rem;
  }

  @media (max-width: 48rem) {
    .video-card {
      max-width: 100%;
      min-width: 16rem;
    }
  }

  @media (min-width: 48.063rem) and (max-width: 64rem) {
    .video-card {
      max-width: 19rem;
      min-width: 17rem;
    }
  }

  @media (min-width: 64.063rem) and (max-width: 85.375rem) {
    .video-card {
      max-width: 21rem;
      min-width: 18rem;
    }
  }

  @media (min-width: 85.376rem) {
    .video-card {
      max-width: 22rem;
      min-width: 20rem;
    }
  }
`

const VideoCardSkeleton = () => {
  return (
    <StyledVideoCardSkeleton>
      <div className="video-card">
        <div className="relative shrink-0 w-full">
          <div className="skeleton w-full h-[14.5rem] rounded-[1.25rem]" />
        </div>
        <div className="video-info">
          <div className="skeleton w-9 h-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-3 w-2/3 rounded" />
            <div className="skeleton h-3 w-1/3 rounded" />
          </div>
        </div>
      </div>
    </StyledVideoCardSkeleton>
  )
}

export default VideoCardSkeleton