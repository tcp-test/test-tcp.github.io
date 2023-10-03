export const metadata = {
  title: '交易记录',
  description: 'Page description',
}

import Hero from '@/components/hero-record'
import Clients from '@/components/clients'
import Customers from '@/components/customers'
import RecordList from '@/components/record-list'
import CtaDark from '@/components/cta-dark'

export default function WallOfLove() {
  return (
    <>
      <Hero />
      {/* <Clients /> */}
      {/* <Customers /> */}
      <RecordList />
      {/* <CtaDark /> */}
    </>
  )
}
