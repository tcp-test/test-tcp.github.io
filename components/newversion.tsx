import Animation from '@/components/ui/animation'
import { useAccount, useBalance, useChainId, useContractRead,useContractReads, useContractWrite, useToken, useWaitForTransaction } from 'wagmi'
import { newVersionUpgradeableConfig,oldTcpPositionUpgradeableConfig,oldTcpTokenUpgradeableConfig,tcpPositionUpgradeableConfig,tcpTokenUpgradeableConfig } from './types/contracts';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react'
import { formatEther,parseEther,MaxUint256,ZeroAddress } from 'ethers';
import Button from './utils/Button';

export default function NewVersion({close}) {
  const chainId = useChainId();
  const { address, isConnecting, isDisconnected } = useAccount();
  const [allowance,setAllowance] = useState<number>(0);
  const [balance,setBalance] = useState<number>(0);
  const [lockAmount,setLockAmount] = useState<number>(0);
  const [approveLoading,setApproveLoading] = useState<boolean>(false);
  let approveDisabled = allowance != 0  && allowance >= balance;

  const [postionDisabled,setPostionDisabled] = useState<boolean>(false);

  const [updateLoading,setUpdateLoading] = useState<boolean>(false);
  const [updateDisabled,setUpdateDisabled] = useState<boolean>(false);
  const updatekWrite = useContractWrite({
    address:newVersionUpgradeableConfig.address[chainId],
    abi:newVersionUpgradeableConfig.abi,
    functionName: 'update',
    onError(error) {
      setUpdateLoading(false);
      setUpdateDisabled(false);
      toast.error(error.details);
    },
  })

  useWaitForTransaction({
    hash: updatekWrite.data?.hash,
    onSuccess(data) {
      if(data.blockNumber){
        toast.success("升级成功,即将关闭窗口");
        setTimeout(()=>{close()},2000)
      }
    }
  })



  const {  data, isSuccess, write } = useContractWrite({
    address:oldTcpTokenUpgradeableConfig.address[chainId],
    abi:oldTcpTokenUpgradeableConfig.abi,
    functionName: 'approve',
    // args: ["0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",parseEther("1000000000")],
    onError(error) {
      setApproveLoading(false);
      toast.error(error.details);
    },
  })

  //授权
  useContractRead({
    address:oldTcpTokenUpgradeableConfig.address[chainId],
    abi:oldTcpTokenUpgradeableConfig.abi,
    functionName: 'allowance',
    args: [address,newVersionUpgradeableConfig.address[chainId]],
    chainId,
    watch: true,
    onSuccess(data) {
      if(data){
        setAllowance(Number(formatEther(data?.toString())));
      }
    },
    onError(error) {
      console.log("allowance",error)
    },
  })

    //获取余额
 useBalance({
  address: address,
  token: oldTcpPositionUpgradeableConfig.address[chainId],
  watch: true,
  onSuccess(data) {
      if(data){
        setBalance(Number(data.formatted));
      }
    },
  })

  useEffect(() => {
    if(allowance >= balance){
      setApproveLoading(false);
    }
  },[allowance,balance])

  useEffect(() => {
    console.log("approveDisabled,postionDisabled1",approveDisabled,postionDisabled);
    if(!approveDisabled || !postionDisabled){
      console.log("approveDisabled,postionDisabled2",approveDisabled,postionDisabled);
      setUpdateDisabled(true);
    }else{
      setUpdateDisabled(false);
    }
  },[approveDisabled,postionDisabled])

  useContractReads({
    contracts: [
      {
        address:tcpPositionUpgradeableConfig.address[chainId],
        abi:tcpPositionUpgradeableConfig.abi,
        functionName: 'getLockAmount',
        args:[address]
      },
      {
        address:tcpPositionUpgradeableConfig.address[chainId],
        abi:tcpPositionUpgradeableConfig.abi,
        functionName: 'getWaitHarvest',
        args:[address]
      }
    ],
    watch:true,
    onSuccess:(data)=>{
      console.log("useContractReads",data)
      setLockAmount((Number(formatEther(data[0].result))+Number(formatEther(data[1].result))).toFixed(3));
    }
  });
  return (
    <section className="w-full">
      <Animation
        {...{
          renderer: 'svg',
          loop: true,
          path:`/videos/boost.json`,
          // canvasStyle: { width: 30, hight: 30 },
        }}
      />
      <div className='text-center mt-3 w-full'>
        <div className='font-bold text-2xl'>
          <span>全新版本,</span>
          <span className="animate-pulse bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-800">更加安全</span>
        </div>
      </div>
      <div className='mt-3 space-y-2 break-all'>
        <div >
          <div className='font-bold text-lg'>「代币升级」</div>
          <ul className="list-inside list-disc ml-3">
            <li className='text-sm'>新代币地址:{tcpTokenUpgradeableConfig.address[chainId]}</li>
            <li className='text-sm text-blue-800 '>
              <span className='inline-flex'>
              请批准将您的{balance?balance:""}TCP被映射到新的地址
                <Button isLoading={approveLoading} disabled={approveDisabled || approveLoading} className='w-10 h-6 rounded-lg justify-center flex items-center ml-2'  onClick={()=>{
                  setApproveLoading(true);
                  write({
                    args: [newVersionUpgradeableConfig.address[chainId],MaxUint256]
                  })
                }}>
                  {
                    !approveDisabled && <span className='text-sm'>批准</span>
                  }
                  {
                    approveDisabled && 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>              
                  }
                </Button>
              </span>
            </li>
          </ul>
        </div>
        <div >
          <div className='font-bold text-lg'>「资产升级」</div>
          <ul className="list-inside list-disc ml-3">
            <li className='text-sm'>优化锁仓BUG,让你的资产更安全</li>
            <li className='text-sm text-blue-800'>
            请批准将您的{lockAmount?lockAmount:""}TCP锁仓资产和待领取资产被映射新的地址
              <Button isLoading={false} disabled={postionDisabled} className='w-10 h-6 rounded-lg justify-center flex items-center ml-2 inline-flex'  onClick={()=>{
                  setPostionDisabled(true)
                }}>
                  {
                    !postionDisabled && <span className='text-sm'>批准</span>
                  }
                  {
                    postionDisabled && 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-400">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>              
                  }
                </Button>
            </li>
          </ul>
        </div>
        <div >
          <div className='font-bold text-lg'>「交易升级」</div>
          <ul className="list-inside list-disc ml-3">
            <li className='text-sm'>全新的交易模式,加速社区发展</li>
          </ul>
        </div>
      </div>
      <div className='w-full my-3 mx-auto justify-center flex'>
        <div className='flex flex-col justify-center items-center space-y-3'>
          <button disabled={updateDisabled || updateLoading} className={`${updateDisabled?'bg-slate-600 hover:bg-slate-700 ring-slate-400':'bg-gradient-to-b from-blue-400 to-blue-800 ring-blue-400'}  btn w-24 h-24 rounded-full ring-8 font-bold text-white`}
            onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              setUpdateLoading(true);
              updatekWrite.write({
                value: parseEther('0.003')
              });
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${updateLoading?'flex':'hidden'} w-24 h-24 animate-spin`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            <div className={`${updateLoading?'hidden':' flex'} flex-col justify-center items-center `}>
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path fillRule="evenodd" d="M11.47 4.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5zm.53 7.59l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 12.31z" clipRule="evenodd" />
                </svg>
              </div>
              <div className='w-full'>
              立刻升级
              </div>
            </div>

          </button>
          <span className='text-sm text-gray-400'>
            升级前,请核对上方蓝色字体
          </span>
        </div>
      </div>
      
    </section>
  )
}