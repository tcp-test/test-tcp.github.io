import Image from 'next/image'
import HeroImage from '@/public/images/about-hero.jpg'
import TeamImage from '@/public/images/team.svg'
import IntroImage from '@/public/images/about-intro.jpg'

export default function HeroAbout() {  
  return (
    <section className="relative ">

      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900 pointer-events-none -z-10 mb-48 lg:mb-0 lg:h-[30rem]" aria-hidden="true">
        <div className="h-full " data-aos="fade">
          <Image className="opacity-10 h-full object-cover" src={HeroImage} width={1440} height={497} priority alt="Hero" />
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="pt-32">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center">
            <div className="h3 font-playfair-display text-slate-100">建立自己的 <span className='text-blue-500 italic h1'>专属</span>  团队享更多收益</div>
          </div>

          {/* Hero image */}
          <div className="flex justify-center items-center pt-8" data-aos="fade-up" data-aos-delay="100">
            <Image className="mx-auto rounded-lg" src={TeamImage} width={1024} height={576} priority alt="About intro" />
          </div>

        </div>
      </div>
    </section>
  )
}