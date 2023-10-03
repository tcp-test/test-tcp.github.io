'use client'
import Image from 'next/image'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useAccount, useChainId, useConnect,useContractReads } from 'wagmi'
import Button from './utils/Button'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQuery, gql } from '@apollo/client';
import { formatEther,parseEther,MaxUint256,ZeroAddress } from 'ethers';
import Modal from './utils/modal'
import C2cAdd from './c2c-add'
import C2cOrderAdd from './c2c-order-add'
import { tcpPositionUpgradeableConfig } from './types/contracts'


export default function BuyList() {  
  const {address} = useAccount();
  const chainId = useChainId();
  //hightLevel and lowLevel
  const [where,setWhere] = useState<{}>({orderType: "1"})



  const GET_LIST = gql`
    query MyQuery($where: C2CAdvertised_filter = {orderType: "0"}) {
      c2Cadvertiseds(where: $where) {
        total
        sold
        price
        owner
        orderType
        orderCount
        min
        max
        isDelete
        id
        createTime
        nickName
      }
    }
  `;

  const GET_CER_LIST = gql`
    query MyQuery($orderType: BigInt = "0") {
      c2Cadvertiseds(where: {nickName_not: "0", orderType: $orderType}) {
        total
        sold
        price
        owner
        orderType
        orderCount
        min
        max
        isDelete
        id
        createTime
        nickName
      }
    }
  `;

  const GET_OWNER_LIST = gql`
  query MyQuery {
    c2Cadvertiseds(
      where: {owner: "${address?.toLocaleLowerCase()}"}
    ) {
      id
      isDelete
      max
      min
      orderCount
      orderType
      owner
      sold
      price
      total
      createTime
      nickName
    }
  }
  `
  let [c2cAdvertised,setC2cAdvertised] = useState<any>({
    max:"0",
    min:"0",
    orderCount:"0",
    orderType:1,
    price:"0",
    sold:"0",
    total:"0"
  });

  let [currC2cAdvertised,setCurrC2cAdvertised] = useState<any>()

  const ownerResult = useQuery(GET_OWNER_LIST);


  const searchParams = useSearchParams();
  
  
  useEffect(()=>{
    const type = searchParams.get('type')
    console.log("type:",type)
    setC2cAdvertiseds(items => []);
    if(type == 'buy'){
      setC2cAdvertised((existingValues: any) => ({
        // Retain the existing values
        ...existingValues,
        // update the firstName
        max:"0",
        min:"0",
        orderCount:"0",
        orderType:0,
        price:"0",
        sold:"0",
        total:"0"
      }));
      setWhere(existingValues => ({
        // Retain the existing values
        ...existingValues,
        // update the firstName
        orderType: "0",
      }))
    }
    if(type == "sell"){

      setC2cAdvertised((existingValues: any) => ({
        // Retain the existing values
        ...existingValues,
        // update the firstName
        max:"0",
        min:"0",
        orderCount:"0",
        orderType:1,
        price:"0",
        sold:"0",
        total:"0"
      }));
      setWhere(existingValues => ({
        // Retain the existing values
        ...existingValues,
        // update the firstName
        orderType: "1",
      }))
    }
  },[searchParams.get('type')])

  useContractReads({
    contracts: [
      {
        address:tcpPositionUpgradeableConfig.address[chainId],
        abi:tcpPositionUpgradeableConfig.abi,
        functionName: 'getParentAddress',
        args:[address]
      },
      {
        address:tcpPositionUpgradeableConfig.address[chainId],
        abi:tcpPositionUpgradeableConfig.abi,
        functionName: 'getRecommendAccounts',
        args:[address]
      }
    ],
    watch:true,
    onSuccess:(data)=>{
      console.log("useContractReads success",data)
      let list:String[] = [];
      if(data[0].result){
        list.push(data[0].result.toString())
      }
      if(data[1].result){
        for (let index = 0; index < data[1].result.length; index++) {
          const element = data[1].result[index];
          list.push(element.toString())
        }
      }
      setWhere(existingValues => ({
        // Retain the existing values
        ...existingValues,
        // update the firstName
        owner_in: list,
      }))
    },
    onError:(e)=>{
      console.log("useContractReads error",e)
    }
  });

  useEffect(()=>{
    const type = searchParams.get('type')
    if(ownerResult.data && ownerResult.data.c2Cadvertiseds ){
      let list = ownerResult.data.c2Cadvertiseds
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if(type == 'buy' && element.orderType == 0){
          setC2cAdvertised(element);
        }
        if(type == 'sell' && element.orderType == 1){
          setC2cAdvertised(element);
        }
      }
    }
  },[ownerResult.data]);



  let [c2cAdvertiseds,setC2cAdvertiseds] = useState<[]>();


  const { loading, error, data } = useQuery(GET_LIST,{variables: { where: where }});

  const cerResult = useQuery(GET_CER_LIST,{variables: { orderType: where.orderType }});


  useEffect(()=>{
    if(data && data.c2Cadvertiseds){
      data.c2Cadvertiseds?.map(o=>{
        setC2cAdvertiseds(oldArray => [...oldArray, o]);
      })
    }
    if(cerResult.data && cerResult.data.c2Cadvertiseds){
      cerResult.data.c2Cadvertiseds?.map(o=>{
        setC2cAdvertiseds(oldArray => [...oldArray, o]);
      })
    }
  },[data,cerResult.data]);



  console.log(data);
  const truncateAddress = (address) => {
    if (!address) return "No Account";
    const match = address.match(
      /^(0x[a-zA-Z0-9]{6})[a-zA-Z0-9]+([a-zA-Z0-9]{8})$/
    );
    if (!match) return address;
    return `${match[1]}...${match[2]}`;
  };


  const [isPopUp,setPopUp] = useState(false);
  const [c2cAdd, setC2cAdd] = useState<boolean>(false);
  const [c2cOrderAdd, setC2cOrderAdd] = useState<boolean>(false)

  return (
    <section className="">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-6 md:py-20 ">
          {/* Testimonials container */}
          <div className="max-w-sm mx-auto sm:max-w-none grid gap-3 sm:grid-cols-2 md:grid-cols-3 sm:gap-x-6 sm:gap-y-8 items-start mb-12 md:mb-16" data-aos-id-testimonials>
            {/* 1st Testimonial */}
            {
              cerResult.data && cerResult.data.c2Cadvertiseds.map((item,index)=>{
                return (
                <article key={index} className="h-full flex flex-col bg-white p-6 shadow-xl" data-aos="fade-up" data-aos-anchor="[data-aos-id-testimonials]">
                  <header className=''>
                    <div className='flex items-center align-middle space-x-1'>
                        <Jazzicon diameter={20} seed={jsNumberForAddress(item.owner)} />
                        
                        <span className='font-playfair-display text-blue-600'>
                          {item.nickName ? item.nickName : truncateAddress(item.owner)}
                        </span>
                        {
                          item.nickName && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
                          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        }
                        
                      </div>
                    <div className='text-slate-500'>
                      <span className='font-playfair-display '>{formatEther(item.sold)}</span>
                      <label className='text-sm'> 成交量</label>
                    </div>
                  </header>
                  
                  <div className=" mt-5 w-full">
                    <span className="h3 text-slate-800  font-playfair-display mr-2" >{formatEther(item.price)}</span>
                    <span className="text-sm font-medium">USDT</span>
                  </div>
                  <div className="flex space-x-2 mt-2 font-medium">
                    <p className="text-slate-500">数量</p>
                    <p className="">{Number(formatEther(item.total))-Number(formatEther(item.sold))} TCP</p>
                  </div>
                  <div className="flex space-x-2 mt-2 font-medium">
                    <p className="text-slate-500">限额</p>
                    <p className="">{formatEther(item.min)}-{formatEther(item.max)} TCP</p>
                  </div>
                  <div className='mt-2'>
                    {
                      item.orderType == 0 && <button className='btn bg-green-600 w-full text-white rounded-md' onClick={(event)=>{
                        event.preventDefault();
                        event.stopPropagation();
                        console.log(1234)
                        setCurrC2cAdvertised(item);
                        setC2cOrderAdd(true);
                      }}>购买 TCP</button>
                    }
                    {
                      item.orderType == 1 && <button className='btn bg-red-600 w-full text-white rounded-md' onClick={(event)=>{
                        event.preventDefault();
                        event.stopPropagation();
                        console.log(4321)
                        setCurrC2cAdvertised(item);
                        setC2cOrderAdd(true);
                      }}>出售 TCP</button>
                    }
                  </div>
                </article>
                )
              })
            }
            {
              data && data.c2Cadvertiseds.map((item,index)=>{
                return (
                <article key={index} className="h-full flex flex-col bg-white p-6 shadow-xl" data-aos="fade-up" data-aos-anchor="[data-aos-id-testimonials]">
                  <header className=''>
                    <div className='flex items-center align-middle space-x-1'>
                        <Jazzicon diameter={20} seed={jsNumberForAddress(item.owner)} />
                        
                        <span className='font-playfair-display text-blue-600'>
                          {item.nickName ? item.nickName : truncateAddress(item.owner)}
                        </span>
                        {
                          item.nickName && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-400">
                          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        }
                        
                      </div>
                    <div className='text-slate-500'>
                      <span className='font-playfair-display '>{formatEther(item.sold)}</span>
                      <label className='text-sm'> 成交量</label>
                    </div>
                  </header>
                  
                  <div className=" mt-5 w-full">
                    <span className="h3 text-slate-800  font-playfair-display mr-2" >{formatEther(item.price)}</span>
                    <span className="text-sm font-medium">USDT</span>
                  </div>
                  <div className="flex space-x-2 mt-2 font-medium">
                    <p className="text-slate-500">数量</p>
                    <p className="">{Number(formatEther(item.total))-Number(formatEther(item.sold))} TCP</p>
                  </div>
                  <div className="flex space-x-2 mt-2 font-medium">
                    <p className="text-slate-500">限额</p>
                    <p className="">{formatEther(item.min)}-{formatEther(item.max)} TCP</p>
                  </div>
                  <div className='mt-2'>
                    {
                      item.orderType == 0 && <button className='btn bg-green-600 w-full text-white rounded-md' onClick={(event)=>{
                        event.preventDefault();
                        event.stopPropagation();
                        console.log(1234)
                        setCurrC2cAdvertised(item);
                        setC2cOrderAdd(true);
                      }}>购买 TCP</button>
                    }
                    {
                      item.orderType == 1 && <button className='btn bg-red-600 w-full text-white rounded-md' onClick={(event)=>{
                        event.preventDefault();
                        event.stopPropagation();
                        console.log(4321)
                        setCurrC2cAdvertised(item);
                        setC2cOrderAdd(true);
                      }}>出售 TCP</button>
                    }
                  </div>
                </article>
                )
              })
            }
          </div>
          <div className={`text-center fixed bottom-0 right-0 ${isPopUp?'hidden':''}`} onClick={()=>{setPopUp(true)}}>
            <button className=" text-white bg-yellow-600 hover:bg-yellow-700 group w-10 h-16 rounded-l-lg  animate-bounce2">
             <div className="tracking-normal text-white-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out">&lt;-</div>
            </button>
          </div>
          <div  className={`text-center fixed bottom-0 right-0 ${isPopUp?'':'hidden'}`}>
            <div className=" text-white  h-16">
              <div className='h-full my-auto btn border-r-white bg-yellow-600 hover:bg-yellow-700 rounded-l-lg' onClick={()=>{setC2cAdd(true)}}>发布</div>
              <button className=" text-white bg-yellow-600 hover:bg-yellow-700 group w-10 h-16 rounded-r-lg" onClick={()=>{setPopUp(false)}}>
                <div className="tracking-normal text-white-300 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out">-&gt;</div>
              </button>
            </div>

          </div>
        </div>
      </div>
      <Modal id="C2cOrderAdd" ariaLabel='1232' show={c2cOrderAdd} handleClose={()=>{setC2cOrderAdd(false)}}>
        <C2cOrderAdd close={()=>{setC2cOrderAdd(false)}} c2cAdvertised={currC2cAdvertised}/>
      </Modal>
      <Modal id="C2cAdd" ariaLabel='1232' show={c2cAdd} handleClose={()=>{setC2cAdd(false)}}>
        <C2cAdd close={()=>{setC2cAdd(false)}} c2cAdvertised={c2cAdvertised}/>
      </Modal>
    </section>
  )
}