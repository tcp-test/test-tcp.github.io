export const metadata = {
  title: '成交记录',
  description: 'Page description',
}

import Hero from '@/components/hero-transaction'
import Clients from '@/components/clients'
import Customers from '@/components/customers'
import TransactionList from '@/components/transaction-list'
import CtaDark from '@/components/cta-dark'

export default function WallOfLove() {
  return (
    <>
      <Hero />
      {/* <Clients /> */}
      {/* <Customers /> */}
      <TransactionList />
      {/* <CtaDark /> */}
    </>
  )
}
