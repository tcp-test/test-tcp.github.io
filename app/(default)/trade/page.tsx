export const metadata = {
  title: '交易',
  description: 'Page description',
}

import Hero from '@/components/hero-wol'
import Clients from '@/components/clients'
import Customers from '@/components/customers'
import BuyList from '@/components/buy-list'
import CtaDark from '@/components/cta-dark'

export default function WallOfLove() {
  return (
    <>
      <Hero />
      {/* <Clients /> */}
      {/* <Customers /> */}
      <BuyList />
      {/* <CtaDark /> */}
    </>
  )
}
