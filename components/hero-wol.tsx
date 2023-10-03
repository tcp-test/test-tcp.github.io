'use client'
import VideoThumb from '@/public/images/wof-hero.jpg'
import ModalVideo02 from '@/components/modal-video-02'
import { useSearchParams } from 'next/navigation'

export default function HeroWol() {  
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  
  return (
    <section className="relative">

      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900 pointer-events-none -z-10" aria-hidden="true"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-24 pb-12">

          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="h2 font-playfair-display text-white">{type == 'buy'? '我要买':'我要卖'}</h2>
          </div>
        </div>
        {/* <div className='h-60'>

        </div> */}
      </div>
    </section>
  )
}