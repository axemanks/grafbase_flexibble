// project cards
"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


type Props = {
    id: string;
    image: string;
    title: string;
    name: string;
    avatarUrl: string;
    userId: string;
}

const ProjectCard = ({ id, image, title, name, avatarUrl, userId}: Props) => {
  // states for random likes and views
  const [randomLikes, setRandomLikes] = useState(0);
  const [randomViews, setRandomViews] = useState('');
// Sets likes and views to random numbers
  useEffect(() => {
    setRandomLikes(Math.floor(Math.random() * 10000))
    setRandomViews(String((Math.floor(Math.random() * 10000) / 1000).toFixed(1) + 'k'))
}, []);


  return (
    // drop shadow
    <div className='flexCenter flex-col rounded-2xl drop-shadow-card'>
      <Link href={`/project/${id}`} 
      className='flexCenter group relative w-full h-full'
      >
        <Image src={image}
        width={414}
        height={314}
        className='w-full h-full object-cover rounded-2xl'
        alt="Project Image"
        />
        <div className='hidden group-hover:flex profile_card-title'>
          <p className='w-full'>{title}</p>
        </div>

      </Link>

      <div className='flexBetween w-full px-2 mt-3 font-semibold text-sm'>
        <Link href={'/profile/${userId}'}>
          {/* Avatar */}
          <div className='flex-center gap-2'>
            <Image src={avatarUrl} width={24} height={24} className='rounded-full' alt='profile-image'/>
          </div>
        </Link>
        {/* desc */}
        <div className='flexCenter gap-3'>
          {/* Likes */}
          <div className='flex-center gap-2'>
            <Image 
            src='/hearth.svg' // misspelled
            width={13}
            height={12}
            alt='heart'
            />
            <p className='text-sm'>525</p>
          </div>
          {/* Views */}
          <div className='flex-center gap-2'>
            <Image 
            src='/eye.svg' // misspelled
            width={13}
            height={12}
            alt='view'
            />
            <p className='text-sm'>5.2K</p>
            {/* Name */}
            <p>{name}</p>
          </div>

        </div>
      </div>
        

    </div>
  )
}

export default ProjectCard