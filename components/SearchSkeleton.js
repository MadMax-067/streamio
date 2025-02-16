import React from 'react'
import styled from 'styled-components'

const StyledSearchSkeleton = styled.div`
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
`

const SearchSkeleton = () => {
  return (
    <StyledSearchSkeleton>
      <div className="space-y-6">
        {/* Channel Result Skeleton */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/30">
          <div className="skeleton w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-48 rounded" />
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-4 w-24 rounded" />
          </div>
        </div>

        {/* Video Result Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 rounded-lg bg-gray-800/30 p-4">
          <div className="relative w-full md:w-64 aspect-video">
            <div className="skeleton w-full h-full rounded-lg" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-full rounded" />
            <div className="flex items-center gap-2 mt-2">
              <div className="skeleton w-6 h-6 rounded-full" />
              <div className="skeleton h-4 w-32 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
            <div className="skeleton h-16 w-full rounded" />
          </div>
        </div>
      </div>
    </StyledSearchSkeleton>
  )
}

export default SearchSkeleton