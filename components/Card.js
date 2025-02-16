import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

const Card = ({ thumbnail, duration }) => {
  const formatDuration = (totalSeconds) => {
    if (!totalSeconds) return ''

    // Round down fractional seconds
    const flooredSeconds = Math.floor(totalSeconds)

    const hours = Math.floor(flooredSeconds / 3600)
    const minutes = Math.floor((flooredSeconds % 3600) / 60)
    const seconds = flooredSeconds % 60

    const hh = hours.toString().padStart(2, '0')
    const mm = minutes.toString().padStart(2, '0')
    const ss = seconds.toString().padStart(2, '0')

    return hours > 0 ? `${hh}:${mm}:${ss}` : `${mm}:${ss}`
  }

  return (
    <StyledWrapper>
      <div className="card">
        <div className="card__image-wrapper">
          <Image
            src={thumbnail}
            alt="Thumbnail"
            layout="fill"
            objectFit="cover"
            className="card__image"
            priority
          />
        </div>
        <div className="card__icons">
          <svg className="svg-icon" height={100} viewBox="0 0 100 100" width={100} xmlns="http://www.w3.org/2000/svg">
            <path d="M50,35.7V50L60.7,60.7M82.1,50A32.1,32.1,0,1,1,50,17.9,32.1,32.1,0,0,1,82.1,50Z" strokeWidth={8}></path>
          </svg>
          <svg className="svg-icon" height={100} viewBox="0 0 100 100" width={100} xmlns="http://www.w3.org/2000/svg">
            <path d="M17.7,28.5H82.3a5.4,5.4,0,0,0,5.4-5.4,5.4,5.4,0,0,0-5.4-5.4H17.7a5.4,5.4,0,0,0-5.4,5.4A5.4,5.4,0,0,0,17.7,28.5Z" fillRule="evenodd"></path>
            <path d="M82.3,44.6H17.7a5.4,5.4,0,0,0,0,10.8H82.3a5.4,5.4,0,1,0,0-10.8Z" fillRule="evenodd"></path>
            <path d="M50,71.5H17.7a5.4,5.4,0,0,0-5.4,5.4,5.4,5.4,0,0,0,5.4,5.4H50a5.4,5.4,0,0,0,5.4-5.4A5.4,5.4,0,0,0,50,71.5Z" fillRule="evenodd"></path>
          </svg>
        </div>
        {duration && (
          <div className="card__time">
            {formatDuration(duration)}
          </div>
        )}
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  .card {
    width: 22rem;
    height: 14.5rem;
    aspect-ratio: 16/9;
    position: relative;
    border-radius: 1.25rem;
    border: 0.0625rem solid rgb(156, 151, 151);
    transition: all 0.3s ease;
    overflow: hidden; /* Ensure the image doesn't overflow the card */
  }

  .card__image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 1.25rem;
    overflow: hidden;
  }

  .card__icons {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding-right: 1rem;
    padding-top: 1rem;
    gap: 0.875rem;
    opacity: 0;
    transition: all 0.3s ease;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
  }

  .card__time {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.25rem;
    font-weight: lighter;
    border-radius: 0.5rem;
    text-align: center;
    padding: 0.25rem 0.75rem;
    color: whitesmoke;
    background-color: rgba(0, 0, 0, 0.8);
  }

  .svg-icon {
    background-color: rgb(77, 67, 67);
    fill: #ece6e6;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 0.5rem;
    padding: 0.25rem;
    transition: all 0.5s ease-in-out;
  }

  .card:hover {
    opacity: 0.8;
    animation: video 5s ease;
  }

  .card:hover .card__icons {
    opacity: 1;
  }

  /* Responsive breakpoints */
  @media (max-width: 48rem) {
    .card {
      width: 100%;
      max-width: 20rem;
      height: 13rem;
    }
    
    .card__icons {
      padding-right: 0.5rem;
      padding-top: 0.5rem;
      gap: 0.5rem;
    }
  }

  @media (min-width: 48.063rem) and (max-width: 85.375rem) {
    .card {
      width: 20rem;
      height: 13rem;
    }
    
    .card__icons {
      padding-right: 0.75rem;
      padding-top: 0.75rem;
      gap: 0.75rem;
    }

    .svg-icon {
      width: 2.5rem;
      height: 2.5rem;
    }

    .card__time {
      font-size: 1.125rem;
    }
  }

  @media (min-width: 85.376rem) {
    .card {
      width: 22rem;
      height: 14.5rem;
    }
  }
`

export default Card
