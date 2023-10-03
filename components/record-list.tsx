'use client'
import Image from 'next/image'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useAccount, useConnect } from 'wagmi'
import Button from './utils/Button'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, gql } from '@apollo/client';
import { formatEther,parseEther,MaxUint256,ZeroAddress } from 'ethers';
import Modal from './utils/modal'
import C2cAdd from './c2c-add'
import C2cOrderAdd from './c2c-order-add'
import moment from 'moment'
import Animation from '@/components/ui/animation'


export default function RecordList() {  
  const {address} = useAccount();
  const OWNER_RECORD_LIST = gql`
  query RecordQuery {
    c2Corders(
      where: {owner: "${address?.toLocaleLowerCase()}"}
      orderBy: createTime
      orderDirection: desc
    ) {
      price
      owner
      createTime
      amount
      adId
      seller
      id
      c2CAdvertised {
        id
        orderType
      }
      quantity
    }
  }
  `









  const { loading, error, data } = useQuery(OWNER_RECORD_LIST);
  console.log("OWNER_RECORD_LIST",data);


  const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
      /^(0x[a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/
    );
    if (!match) return address;
    return `${match[1]}...${match[2]}`;
  };
  

  return (
    <section className="">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-6 md:py-20 ">
          {/* Testimonials container */}
          <div className="max-w-sm mx-auto sm:max-w-none grid gap-3 sm:grid-cols-2 md:grid-cols-1 sm:gap-x-6 sm:gap-y-8 items-start mb-12 md:mb-16" data-aos-id-testimonials>
            {/* 1st Testimonial */}
            
            {
              (!data || !data.c2Corders || data.c2Corders.length <= 0) &&  <Animation
              {...{
                renderer: 'svg',
                loop: true,
                path:`/videos/empty.json`,
                canvasStyle: { margin:'auto',width:350},
              }}
            />
            }
            {
              data && data.c2Corders.map((item,index)=>{
                return (
                <article key={index} className="h-full flex flex-col bg-white p-6 shadow-xl" data-aos="fade-up" data-aos-anchor="[data-aos-id-testimonials]">
                  <header className=''>
                    <div className='flex items-center align-middle space-x-1 font-bold'>
                      {
                        item.c2CAdvertised.orderType == 0 && <span className='text-green-500'>购买</span>
                      }
                      {
                        item.c2CAdvertised.orderType == 1 && <span className='text-red-500'>出售</span>
                      }
                      <span className=''>TCP</span>
                    </div>
                  </header>
                  <div className='flex justify-between mt-2 text-sm'>
                    <div className="">
                      <p className="text-slate-500">时间</p>
                      <p className="">{moment(moment.unix(item.createTime)).format('YYYY-MM-DD HH:mm')}</p>
                    </div>
                    <div className="">
                      <p className="text-slate-500">数量(TCP)</p>
                      <p className="">{formatEther(item.quantity)}</p>
                    </div>
                    <div className="">
                      <p className="text-slate-500">交易总额(USDT)</p>
                      <p className="">{formatEther(item.amount)}</p>
                    </div>
                  </div>
                  <div>
                  <div className="flex text-sm mt-2">
                      <p className="text-slate-500 ">商家</p>
                      <p className="">{truncateAddress(item.seller)}</p>
                    </div>
                  </div>
                </article>
                )
              })
            }
          </div>
          
        </div>
      </div>

    </section>
  )
}