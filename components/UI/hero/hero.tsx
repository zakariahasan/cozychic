import React from 'react';
import Image from 'next/image';

const Hero = () => {
    return (
        <div className='relative h-[300px] my-10 md:h-[600px] lg:h-[750px] w-full" flex justify-center items-center'>
            <Image src={'/images/hero/hero.png'}
                    alt='cozy chic'
                    fill
                    className='' />
        </div>
    )
}

export default Hero;
