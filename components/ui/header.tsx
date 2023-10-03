'use client'
import Link from 'next/link'
import Logo from './logo'
import Dropdown from '@/components/utils/dropdown'
import MobileMenu from './mobile-menu'
import ConnectWallet from '@/components/utils/ConnectWallet'
import Modal from '../utils/modal'
import { useEffect, useState } from 'react'
import NewVersion from '../newversion'
import { newVersionUpgradeableConfig, tcpPositionUpgradeableConfig } from '../types/contracts'
import { useAccount, useBalance, useChainId, useContractRead, useContractWrite, useToken, useWaitForTransaction } from 'wagmi'
import { useSearchParams } from 'next/navigation'
import { useSessionStorage } from '@uidotdev/usehooks'
import { ZeroAddress } from 'ethers'


export default function Header({ mode = 'dark' }: {
  mode?: string
}) {
  const [positionAdd, setPositionAdd] = useState<boolean>(false);
  const [parentAddress, setParentAddress] = useSessionStorage("parent-address", "");
  const chainId = useChainId();
  const { address, isConnecting, isDisconnected } = useAccount();
  useContractRead({
    address:newVersionUpgradeableConfig.address[chainId],
    abi:newVersionUpgradeableConfig.abi,
    functionName: 'needToUpgrade',
    args:[address],
    watch:true,
    onSuccess:(data)=>{
      console.log("needToUpgrade",data)
      setPositionAdd(data)
      
    }
  });

  useContractRead({
    address:tcpPositionUpgradeableConfig.address[chainId],
    abi:tcpPositionUpgradeableConfig.abi,
    functionName: 'getParentAddress',
    args:[address],
    watch:true,
    onSuccess:(data)=>{
      console.log("getParentAddress",data)
      let address = searchParams.get("address")
      if(address){
        setParentAddress(address)
      }else if(data !== ZeroAddress){
        setParentAddress(data)
      }else{
        setParentAddress("")
      }
    }
  });

  const searchParams = useSearchParams();

  
  return (
    <header className={`absolute w-full z-30 ${mode !== 'light' && 'dark'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">

            {/* Desktop menu links */}
            <ul className="flex grow justify-start flex-wrap items-center">
              <li>
                <Link href="/" className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">首页</Link>
              </li>
              {/* 1st level: hover */}
              <Dropdown title="交易">
                {/* 2nd level: hover */}
                <li>
                  <Link href={{pathname: "/trade",query: { type: 'buy' }}} className="font-medium text-sm text-gray-600 hover:text-gray-900 flex py-2 px-5 leading-tight">我要买</Link>
                </li>
                <li>
                  <Link href={{pathname: "/trade",query: { type: 'sell' }}} className="font-medium text-sm text-gray-600 hover:text-gray-900 flex py-2 px-5 leading-tight">我要卖</Link>
                </li>
                <li>
                  <Link href={{pathname: "/transaction"}} className="font-medium text-sm text-gray-600 hover:text-gray-900 flex py-2 px-5 leading-tight">成交记录</Link>
                </li>
                <li>
                  <Link href={{pathname: "/record"}} className="font-medium text-sm text-gray-600 hover:text-gray-900 flex py-2 px-5 leading-tight">交易记录</Link>
                </li>
              </Dropdown>
              <li>
                <Link href="/fqa" className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">系统消息</Link>
              </li>
              <li>
                <Link href="/fqa" className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">常见问题</Link>
              </li>
              <Dropdown title="我的">
                {/* 2nd level: hover */}
                <li>
                  <Link href="/group" className="font-medium text-sm text-gray-600 hover:text-gray-900 flex py-2 px-5 leading-tight">我的团队</Link>
                </li>
              </Dropdown>
              
            </ul>

            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              {/* <li>
                <Link href="/signin" className="font-medium text-slate-800 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out">Sign in</Link>
              </li>
              <li>
                <Link href="/request-demo" className="font-medium text-blue-600 dark:text-slate-300 dark:hover:text-white px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out group">
                  Request Demo <span className="tracking-normal text-blue-600 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
                </Link>
              </li> */}
              <li>
                <ConnectWallet />
              </li>
            </ul>

          </nav>

          <MobileMenu />

        </div>
      </div>
      <Modal id="PositionAdd" ariaLabel='1232' show={positionAdd} handleClose={()=>{}}>
        <NewVersion close={()=>{setPositionAdd(false)}}/>
      </Modal>
    </header>
  )
}
