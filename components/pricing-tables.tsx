'use client'

import { useState } from 'react'
import { TcpTokenUpgradeable__factory } from './types/factories/contracts';
import { useAccount, useChainId, useContractRead, useContractReads, useContractWrite, usePublicClient, useWaitForTransaction } from 'wagmi';
import { useContractInfo } from './utils/useContractInfo';
import { formatEther,parseEther } from 'ethers';
import PositionAdd from './position-add';
import Modal from './utils/modal';
import { tcpPositionUpgradeableConfig } from './types/contracts'
import { da } from 'date-fns/locale';
import Button from './utils/Button';
import toast from 'react-hot-toast';


export default function PricingTables() {
  
  const [positionAdd, setPositionAdd] = useState<boolean>(false)
  const chainId = useChainId();
  const { address, isConnecting, isDisconnected } = useAccount();

  const [lockAmount,setLockAmount] = useState<number>(0);
  const [unlockAmount,setUnlockAmount] = useState<number>(0);
  const [waitHarvest,setWaitHarvest] = useState<number>(0);
  const [harvestAmount,setHarvestAmount] = useState<number>(0);

  const [harverstLoading,setHarverstLoading] = useState(false);
  const [relockLoading,setRelockLoading] = useState(false);
  // const { data, isRefetching, isSuccess, refetch } = useContractRead({
  //   address: address,
  //   abi: abi,
  //   functionName: 'getAlive',
  // })
  //获取参数
  useContractReads({
    contracts: [
      {
        address:tcpPositionUpgradeableConfig.address[chainId],
        abi:tcpPositionUpgradeableConfig.abi,
        functionName: 'getUnlockAmount',
        args:[address]
      },
      {
        address:tcpPositionUpgradeableConfig.address[chainId],
        abi:tcpPositionUpgradeableConfig.abi,
        functionName: 'getWaitHarvest',
        args:[address]
      },
      {
        address:tcpPositionUpgradeableConfig.address[chainId],
        abi:tcpPositionUpgradeableConfig.abi,
        functionName: 'getUserInfo',
        args:[address]
      },
    ],
    watch:true,
    onSuccess:(data)=>{
      console.log("useContractReads",data)
      setLockAmount(Number(formatEther(data[2].result[2])).toFixed(1));
      setUnlockAmount(Number(formatEther(data[0].result)).toFixed(1));
      setWaitHarvest(Number(formatEther(data[1].result)).toFixed(1));
      setHarvestAmount(Number(formatEther(data[2].result[3])).toFixed(1));
    }
  });

  const positionHarverstWrite = useContractWrite({
    address:tcpPositionUpgradeableConfig.address[chainId],
    abi:tcpPositionUpgradeableConfig.abi,
    functionName: 'harvest',
    onError(error) {
      setHarverstLoading(false)
      toast.error(error.details);
    },
  })
  const positionRelockWrite = useContractWrite({
    address:tcpPositionUpgradeableConfig.address[chainId],
    abi:tcpPositionUpgradeableConfig.abi,
    functionName: 'relock',
    onError(error) {
      setRelockLoading(false)
      toast.error(error.details);
    },
  })

  useWaitForTransaction({
    hash: positionHarverstWrite.data?.hash,
    onSuccess(data) {
      if(data.blockNumber){
        toast.success("领取成功");
        setHarverstLoading(false);
      }
    }
  })

  useWaitForTransaction({
    hash: positionRelockWrite.data?.hash,
    onSuccess(data) {
      if(data.blockNumber){
        toast.success("复投成功");
        setRelockLoading(false);
      }
    }
  })
  
  return (
    <div>
      <div className="max-w-sm mx-auto grid gap-8 lg:grid-cols-2 items-start lg:max-w-none pt-4">

        {/* Pricing table 1 */}
        <div className="relative flex flex-col h-full px-6 py-5 bg-white shadow-lg" data-aos="fade-up" data-aos-delay="100">
          <div className='h4 pb-4'><span className='border-l-4 border-blue-800  pl-2'>持仓</span>信息</div>
          <div className="mb-4 pb-4 flex flex-row space-x-3">
            <div className='w-1/2 border-r-3 border-slate-200 text-left'>
              <div className="text-lg font-semibold text-slate-800 mb-1 w-full">持仓金额</div>
              <div className=" items-baseline mb-3  w-full  space-x-1">
                <span className="h2 leading-7 font-playfair-display text-slate-800">{lockAmount}</span>
                <span className=" text-slate-400 font-bold">TCP</span>
              </div>
              <div className="rounded  w-full">
                <button className="btn-sm text-white bg-blue-600 hover:bg-blue-700 group" onClick={(e)=>{e.preventDefault();e.stopPropagation();setPositionAdd(true)}}>添加持仓</button>
                <Modal id="PositionAdd" ariaLabel='1232' show={positionAdd} handleClose={()=>{setPositionAdd(false)}}>
                  <PositionAdd close={()=>{setPositionAdd(false)}}/>
                </Modal>
              </div>
            </div>
            <div className='w-1/2 text-right'>
              <div className="text-lg font-semibold text-slate-800 mb-1 w-full">已释放</div>
              <div className=" items-baseline mb-3  w-full  space-x-1">
                <span className="h2 leading-7 font-playfair-display text-slate-800">{unlockAmount}</span>
                <span className=" text-slate-400  font-bold">TCP</span>
              </div>
              
            </div>
          </div>
 

        </div>
        {/* Pricing table 2 */}
        <div className="relative flex flex-col h-full px-6 py-5 bg-white shadow-lg" data-aos="fade-up" data-aos-delay="100">
          <div className='h4 pb-4'><span className='border-l-4 border-blue-800  pl-2'>复息</span>信息</div>
          <div className="mb-4 pb-4 flex flex-row space-x-3">
            <div className='w-1/2 border-r-3 border-slate-200 text-left'>
              <div className="text-lg font-semibold text-slate-800 mb-1 w-full">待领取</div>
              <div className=" items-baseline mb-3  w-full  space-x-1">
                <span className="h2 leading-7 font-playfair-display text-slate-800">{waitHarvest}</span>
                <span className=" text-slate-400  font-bold">TCP</span>
              </div>
              <div className="rounded  w-full space-x-1 flex">
                <Button isLoading={harverstLoading} disabled={harverstLoading}  onClick={
                    () =>{
                      setHarverstLoading(true);
                      
                      positionHarverstWrite.write({
                        value: parseEther('0.003')
                      });
                    }
                  }>领取</Button>

                <Button isLoading={relockLoading} disabled={relockLoading}  onClick={
                    () =>{
                      setRelockLoading(true);
                      positionRelockWrite.write({
                        value: parseEther('0.003')
                      });
                    }
                  }>复投</Button>
              </div>
            </div>
            <div className='w-1/2  border-slate-200 text-right'>
              <div className="text-lg font-semibold text-slate-800 mb-1 w-full">已领取</div>
              <div className=" items-baseline mb-3  w-full space-x-1">
                <span className="h2 leading-7 font-playfair-display text-slate-800">{harvestAmount}</span>
                <span className="font-bold text-slate-400">TCP</span>
              </div>
              
            </div>
          </div>
 

        </div>

        

      </div>

    </div>
  )
}