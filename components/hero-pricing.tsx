import PricingTables from './pricing-tables';

export default function HeroPricing() {  
  return (
    <section className="relative">

      {/* Dark background */}
      <div className="absolute inset-0 bg-slate-900 pointer-events-none -z-10 h-1/3 lg:h-[48rem] [clip-path:polygon(0_0,_5760px_0,_5760px_calc(100%_-_352px),_0_100%)] bg-[url('/images/banner.webp')] bg-cover bg-left" aria-hidden="true"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 ">
        <div className="pt-28 ">

          {/* Section header */}
          <div className="mx-auto pb-3 space-y-3">
            <div className='h1 text-slate-100'>
              <span className="">更加</span>
              <span className="text-blue-600">安全</span>
            </div>
            
            <div className='text-2xl font-bold text-slate-100'>
              <span className="">您最宝贵的资产现在</span>
              <span className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-800">焕然一新</span>
            </div>
          </div>
          {/* bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600 */}
          <PricingTables />

        </div>
      </div>

    </section>
  )
}