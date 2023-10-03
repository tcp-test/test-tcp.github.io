export const metadata = {
  title: '我的团队',
  description: 'Page description',
}

import Hero from '@/components/hero-about'
import Stats from '@/components/stats-02'
import Content from './content'
import Team from '@/components/team'
import TeamMembers from '@/components/team-members'
import Clients from '@/components/clients-02'
import Cta from '@/components/cta-02'
import TeamIncome from '@/components/team-income'

export default function About() {
  return (
    <>
      <Hero />
      <Stats />
      <TeamIncome/>
    </>
  )
}
