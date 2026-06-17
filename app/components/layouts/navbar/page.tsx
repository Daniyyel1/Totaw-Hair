    'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import tota from '../../../../public/tota.png'
import Image from 'next/image'
import { Search } from 'lucide-react'

const Navbar = () => {

    const pathName = usePathname();

  const naveLinks = [
     {  id:1,
        label: 'Home',
        href: '/',

     },
     {   id:2,
        label: 'Products',
        href: '/components/pages/Products',
        protected: true
     },
     {  id:3,
        label: 'CartPage',
        href: '/components/pages/CartPage',
        protected: true,
     },
     {   id:4,
        label: 'About',
        href: '/components/pages/About'
     },
  ]

  return (
    <div className=' fixed w-full h-20 z-99 top-0 border-b bg-[#FFC0CB]'>
        <div className='max-w-275 mx-auto flex justify-between items-center py-3 font-comorantInfant font-medium'>
            <div className='flex justify-center items-center gap-40'>
                <Image className='h-12 w-12' src={tota} alt='totaw'></Image>
                  <div className=' flex justify-center items-center gap-15'>
                 {
                    naveLinks.map(({href, label, id})=>(
                        <Link key={id} href={href} className={`text-[18px] ${pathName === href ? 'text-[white] font-bold' : 'text-black'}`}>
                              {label}
                        </Link>
                    ))
                 }
                 </div>
            </div>
                 <div className='flex justify-center items-center gap-3'>
                        <div className='border w-9 h-9 rounded-full flex justify-center items-center '>
                          <Search />
                    </div>
                    <Link href='/Login'>
                      <button className='h-10 w-45 text-[18px] bg-[#FFC0CB] rounded-[12px] cursor-pointer  flex justify-center items-center'>Login/Register</button>
                 </Link>
                  
                 </div>

        </div>
    </div>
  )
}

export default Navbar;