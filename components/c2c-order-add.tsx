export const metadata = {
  title: 'Request Demo - Tidy',
  description: 'Page description',
}
import { formatEther,parseEther,MaxUint256,ZeroAddress, parseUnits } from 'ethers';
import { useEffect, useState } from 'react'
import { useAccount, useBalance, useChainId, useContractRead, useContractWrite, useToken, useWaitForTransaction } from 'wagmi'
import { useContractInfo } from './utils/useContractInfo'
import { tcpTokenUpgradeableConfig, c2cMarketUpgradeableConfig, usdcContractConfig } from './types/contracts'
import Button from './utils/Button';
import toast from 'react-hot-toast';
interface C2cAdvertised {
  createTime:number,
  id:number
  isDelete:boolean
  max:string,
  min:string,
  orderCount:number,
  orderType:number,
  owner:string,
  price:string,
  sold:string,
  total:string,
}

interface Props {
  close:any,
  c2cAdvertised:C2cAdvertised,
}

const stepTitle = ["购买","出售"]
export default function C2cOrderAdd({close,c2cAdvertised}: Props) {
  
  const [step,setStep] = useState(0);
  const [balance,setBalance] = useState<number>(0);
  const [usdtBalance,setUsdtBalance] = useState<number>(0);
  const [allowance,setAllowance] = useState<number>(0);
  const [usdtAllowance,setUsdtAllowance] = useState<number>(0);

  const [total,setTotal] = useState<number>(0);
  const [price,setPrice] = useState<number>(Number(formatEther(c2cAdvertised.price)));
  const [min,setMin] = useState<number>(Number(formatEther(c2cAdvertised.min)));
  const [max,setMax] = useState<number>(Number(formatEther(c2cAdvertised.max)));
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
    args: [address,c2cMarketUpgradeableConfig.address[chainId]],
    chainId,
    watch: true,
    onSuccess(data) {
      if(data){
        setAllowance(Number(formatEther(data?.toString())));
      }
    },
  })

  useContractRead({
    address:usdcContractConfig.address,
    abi:usdcContractConfig.abi,
    functionName: 'allowance',
    args: [address,c2cMarketUpgradeableConfig.address[chainId]],
    chainId,
    watch: true,
    onSuccess(data) {
      if(data){
        setUsdtAllowance(Number(formatEther(data?.toString())));
      }
    },
  })

  useEffect(()=>{
    if(step != 0){
      return;
    }
    console.log("tcp allowance",allowance)
    console.log("usdt allowance",usdtAllowance)
    if(c2cAdvertised.orderType == 1 && allowance >= 1000){
      setStep(1)
    }
    if(c2cAdvertised.orderType == 0 && usdtAllowance >= 1000){
      setStep(1)
    }
  },[allowance,usdtAllowance])


  const {  data, isSuccess, write } = useContractWrite({
    address:tcpTokenUpgradeableConfig.address[chainId],
    abi:tcpTokenUpgradeableConfig.abi,
    functionName: 'approve',
    // args: ["0x0B306BF915C4d645ff596e518fAf3F9669b97016",parseEther("1000000000")],
    onError(error) {
      toast.error(error.details);
    },
  })

  const usdtApproveWrite = useContractWrite({
    address:usdcContractConfig.address,
    abi:usdcContractConfig.abi,
    functionName: 'approve',
    // args: ["0x0B306BF915C4d645ff596e518fAf3F9669b97016",parseEther("1000000000")],
    onError(error) {
      toast.error(error.details);
    },
  })

  useWaitForTransaction({
    hash: usdtApproveWrite.data?.hash,
    onSuccess(data) {
      if(data.blockNumber){
        setApproveLoading(false);
      }
    },
  })

  useWaitForTransaction({
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

    if((Number(total) < Number(allowance) && c2cAdvertised.orderType == 1) || (c2cAdvertised.orderType == 0 && Number(total) < Number(usdtAllowance))){
      setLockDisabled(false);
    }
    if(((Number(total) > Number(allowance)  && c2cAdvertised.orderType == 1) || (Number(total) > Number(usdtAllowance)  && c2cAdvertised.orderType == 0)) && step == 1){
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
  }, [total,allowance]) 
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
  useBalance({
    address: address,
    token: usdcContractConfig.address,
    watch: true,
    onSuccess(data) {
      setUsdtBalance(Number(data.formatted).toFixed(3));
    },
  })

  const createC2COrderWrite = useContractWrite({
    address:c2cMarketUpgradeableConfig.address[chainId],
    abi:c2cMarketUpgradeableConfig.abi,
    functionName: 'createC2COrder',
    onError(error) {
      toast.error(error.details);
      setLockLoading(false);
      setLockDisabled(false);
    },
  })



  useWaitForTransaction({
    hash: createC2COrderWrite.data?.hash,
    onSuccess(data) {
      if(data.blockNumber){
        toast.success("交易成功");
        setTimeout(()=>{
          setLockLoading(false);
          setLockDisabled(false);
          close();
        },3000)
      }
    }
  })

  const addC2COrder = () => {
    if(total < 1){
      toast.error("交易数量太低");
      return;
    }
    
    if(c2cAdvertised.orderType && usdtBalance < total){
      toast.error("USDT余额不足");
      return;
    }
    if(c2cAdvertised.orderType == 1 && balance < total){
      toast.error("TCP余额不足");
      return;
    }
    setLockLoading(true);
    createC2COrderWrite.write({
      args: [parseUnits(c2cAdvertised.id.toString(),0),parseEther(total.toString())],
      value: parseEther('0.003'),
    })
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
                <h1 className="h4 font-playfair-display text-slate-800">{stepTitle[c2cAdvertised.orderType]} TCP</h1>
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
                    1、需要通过链上 ERC20 一次性批准{stepTitle[c2cAdvertised.orderType]} TCP
                  </div>
                  <div className={`${step !=1 ? 'text-slate-400':''} flex`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`${step <= 1 ? 'hidden':''} w-6 h-6 text-green-600`}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    2、确认{stepTitle[c2cAdvertised.orderType]} TCP
                  </div>
                  <div className={`${step !=1 ? 'hidden':''} space-y-3`}>
                    <div className='flex '>
                      <div>单价</div>
                      <div className={'ml-2 text-green-600 font-bold'}>{formatEther(c2cAdvertised.price)} USDT</div>
                    </div>
                    <div className='flex  text-sm'>
                      <div>每笔限额</div>
                      <div className={'ml-2  font-bold'}>{formatEther(c2cAdvertised.min)}-{formatEther(c2cAdvertised.max)} TCP</div>
                    </div>
                    <div>
                      <div className='flex justify-between'>
                        <label className=" text-sm font-medium mb-1" htmlFor="total">{stepTitle[c2cAdvertised.orderType]}数量 <span className="text-rose-500">*</span></label>
                        <label className=" text-sm mb-1" htmlFor="total">可用余额:<span className="font-medium ">{c2cAdvertised.orderType == 0 ? usdtBalance:balance} {c2cAdvertised.orderType == 0 ? 'USDT':'TCP'}</span></label>
                      </div>
                      <input id="total" className="form-input py-2 w-full"  type='number'  value={total} onChange={(event)=>{
                          event.preventDefault();
                          event.stopPropagation();
                          if(Number(event.target.value) < Number(formatEther(c2cAdvertised.min)) || Number(event.target.value) > Number(formatEther(c2cAdvertised.max))){
                            toast.error("超出每比限额范围");
                          }
                          setTotal(Number(event.target.value))
                          }} required />
                    </div>

                    <div className='flex '>
                      <div>{c2cAdvertised.orderType == 0 ? '需支付':'将得到'}</div>
                      <div className={'ml-2  font-bold'}>{Number(formatEther(c2cAdvertised.price))*total} USDT</div>
                    </div>
                  </div>
                </div>

                {/* 按钮 */}
                <div className='mt-4'>
                  <div className={`${step !=0 ? 'hidden':''}`}>
                    <Button isLoading={approveLoading} disabled={approveLoading}  onClick={
                      () =>{
                        setApproveLoading(true);
                        if(c2cAdvertised.orderType == 1){
                          write({
                            args: [c2cMarketUpgradeableConfig.address[chainId],MaxUint256]
                          })
                        }else{
                          usdtApproveWrite.write({
                            args: [c2cMarketUpgradeableConfig.address[chainId],MaxUint256]
                          })
                        }

                      }
                    }>允许{stepTitle[c2cAdvertised.orderType]} TCP</Button>
                  </div>

                  <div className={`${step !=1 ? 'hidden':''}`}>
                    <Button isLoading={lockLoading} disabled={lockDisabled || lockLoading}  onClick={addC2COrder}>交易</Button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
