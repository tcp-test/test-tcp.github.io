'use client'
export const metadata = {
  title: 'Request Demo - Tidy',
  description: 'Page description',
}
import { formatEther,parseEther,MaxUint256,ZeroAddress } from 'ethers';
import Link from 'next/link'
import Image from 'next/image'
import PageBg from '@/public/images/request-demo-bg.jpg'
import CustomerAvatar from '@/public/images/customer-avatar-04.jpg'
import Logo from './ui/logo'
import { useEffect, useState } from 'react'
import { useAccount, useBalance, useChainId, useContractRead, useContractWrite, useToken, useWaitForTransaction } from 'wagmi'
import { useContractInfo } from './utils/useContractInfo'
import { tcpTokenUpgradeableConfig,tcpPositionUpgradeableConfig } from './types/contracts'
import Button from './utils/Button';
import toast from 'react-hot-toast';
import { useSessionStorage } from '@uidotdev/usehooks';


const stepTitle = ["请批准 TCP","锁仓 TCP"]
export default function PositionAdd({close}) {
  const [parentAddress, setParentAddress] = useSessionStorage("parent-address", "");

  const [step,setStep] = useState(0);
  const [balance,setBalance] = useState<number>(0);
  const [allowance,setAllowance] = useState<number>(0);

  const [lockNum,setLockNum] = useState<number>(1);

  const [approveLoading,setApproveLoading] = useState(false);
  const [lockLoading,setLockLoading] = useState(false);
  const [lockDisabled,setLockDisabled] = useState(false);
  
  const { address, isConnecting, isDisconnected } = useAccount();
  const chainId = useChainId();
 
  //授权
  useContractRead({
    address:tcpTokenUpgradeableConfig.address[chainId],
    abi:tcpTokenUpgradeableConfig.abi,
    functionName: 'allowance',
    args: [address,tcpPositionUpgradeableConfig.address[chainId]],
    chainId,
    watch: true,
    onSuccess(data) {
      if(data){
        setAllowance(Number(formatEther(data?.toString())));
      }
      console.log("allowanceResult",data)
      if(step == 0 && data && Number(formatEther(data?.toString())) >= 100000000){
        setStep(1);
      }
    },
  })
  const {  data, isSuccess, write } = useContractWrite({
    address:tcpTokenUpgradeableConfig.address[chainId],
    abi:tcpTokenUpgradeableConfig.abi,
    functionName: 'approve',
    // args: ["0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",parseEther("1000000000")],
    onError(error) {
      toast.error(error.details);
    },
  })

  const waitForTransaction = useWaitForTransaction({
    hash: data?.hash,
    onSuccess(data) {
      if(data.blockNumber){
        setApproveLoading(false);
      }
    },
  })

  useEffect(() => {
    console.log("step",step)
  }, [step]) 
  


  useEffect(() => {
    console.log("lockNum",lockNum)
    console.log("allowance",allowance)
    if(lockNum < allowance){
      setLockDisabled(false);
    }
    if(Number(lockNum) > Number(allowance) && step == 1){
      setLockDisabled(true);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-2">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="mt-1 text-sm text-gray-500">
                  你输入的金额超过授权额度.需要前往增加授权额度嘛?
                </p>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={(e) => {e.preventDefault();setStep(0);toast.dismiss(t.id);console.log("close")}}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-500 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              去授权
            </button>
          </div>
        </div>
      ),{
        position:'bottom-center',
        duration:5000
      })
    }
  }, [lockNum,allowance]) 
  //锁仓
  //获取余额
 useBalance({
    address: address,
    token: tcpTokenUpgradeableConfig.address[chainId],
    watch: true,
    onSuccess(data) {
      setBalance(Number(data.formatted).toFixed(3));
    },
  })

  const positionLockWrite = useContractWrite({
    address:tcpPositionUpgradeableConfig.address[chainId],
    abi:tcpPositionUpgradeableConfig.abi,
    functionName: 'lock',
    onError(error) {
      toast.error(error.details);
      setLockLoading(false);
      setLockDisabled(false);
    },
  })

  useWaitForTransaction({
    hash: positionLockWrite.data?.hash,
    onSuccess(data) {
      if(data.blockNumber){
        toast.success("锁仓成功");
        setTimeout(()=>{
          setLockLoading(false);
          setLockDisabled(false);
          close();
        },3000)
      }
    }
  })

  const positionLock = () => {
    if(lockNum < 1){
      toast.error("锁仓数量太低");
      return;
    }
    if(!parentAddress){
      toast.error("请使用邀请链接打开");
      return;
    }
    setLockLoading(true);
    
    positionLockWrite.write({
      args: [address,parseEther(lockNum.toString()),parentAddress],
      value: parseEther('0.003'),
    });
  }


  return (
    <>
      <div className="">
        <div className="  flex flex-col justify-center">
          <div className="px-5 sm:px-6 py-8">
            <div className="max-w-md mx-auto">

              {/* Site branding */}
              <div className="mb-6 flex justify-between">
                {/* Logo */}
                <h1 className="h4 font-playfair-display text-slate-800">{stepTitle[step]}</h1>
                {/* <Logo/> */}
                <button onClick={close}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              {/* step */}
              <div className='text-sm space-y-3'>
                  <div className={`${step !=0 ? 'text-slate-400':''} flex`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${step <= 0 ? 'hidden':''} w-6 h-6 text-green-600`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    1、需要通过链上 ERC20 批准交易一次性批准 TCP
                  </div>
                  <div className={`${step !=1 ? 'text-slate-400':''} flex`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${step <= 1 ? 'hidden':''} w-6 h-6 text-green-600`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    2、确认将 TCP 锁仓
                  </div>
                  <div className={`${step !=1 ? 'hidden':''}`}>
                    <div className='flex justify-between'>
                      <label className=" text-sm font-medium mb-1" htmlFor="lockNum">您锁仓 <span className="text-rose-500">*</span></label>
                      <label className=" text-sm font-medium mb-1" htmlFor="lockNum">余额:{balance} <span className="text-blue-700" onClick={(e)=>{e.preventDefault();setLockNum(balance)}}>最大</span></label>
                    </div>
                    <input id="lockNum" className="form-input py-2 w-full"  type='number'  value={lockNum} onChange={(event)=>{
                        event.preventDefault();
                        event.stopPropagation();
                        setLockNum(Number(event.target.value))
                        }} required />
                  </div>
                </div>

                {/* 按钮 */}
                <div className='mt-4'>
                  <div className={`${step !=0 ? 'hidden':''}`}>
                    <Button isLoading={approveLoading} disabled={approveLoading}  onClick={
                      () =>{
                        setApproveLoading(true);
                        write({
                          args: [tcpPositionUpgradeableConfig.address[chainId],MaxUint256]
                        })
                      }
                    }>允许锁仓 TCP</Button>
                  </div>

                  <div className={`${step !=1 ? 'hidden':''}`}>
                    <Button isLoading={lockLoading} disabled={lockDisabled || lockLoading}  onClick={positionLock}>锁仓 TCP</Button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
