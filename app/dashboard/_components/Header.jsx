"use client";
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const Header = () => {

    return (
        <div className='flex p-4 justify-between bg-gray-100 shadow-sm'>
            <Image className='hidden md:block' src='/logo.svg' height={50} width={50} alt='logo' />
            <h2 className='p-2 text-[20px] text-Indigo-900 poppins font-bold'>Intervio</h2>
            <UserButton showName />
        </div>
    )
}

export default Header