'use client'

import { useState } from "react";
import { useAccount, useChainId, useContractRead } from "wagmi";
import { tcpPositionUpgradeableConfig } from "./types/contracts";
import { formatEther } from "ethers";

export default function TeamIncome() {  

  const [referralUser, setReferralUser] = useState<number>(0);
  const [referralReward, setReferralReward] = useState<number>(0);

  const [markerLevel, setMarkerLeve] = useState<number>(0);
  const [markerReward, setMarkerReward] = useState<number>(0);
  const chainId = useChainId();
  const { address, isConnecting, isDisconnected } = useAccount();
  useContractRead({
    address:tcpPositionUpgradeableConfig.address[chainId],
    abi:tcpPositionUpgradeableConfig.abi,
    functionName: 'getUserInfo',
    args:[address],
    watch:true,
    onSuccess:(data)=>{
      setReferralUser(Number(data[4]));
      setReferralReward(Number(formatEther(data[5])).toFixed(2));
      setMarkerLeve(Number(formatEther(data[6])));
      setMarkerReward(Number(formatEther(data[7])).toFixed(2));
    }
  });
  return (
    <section className="-mt-10">

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">

          <div className="bg-white px-3 py-3 sm:py-6 shadow-xl rounded-lg">
            <h4 className="h4 w-full text-center">我的收益</h4>
            <ul className="flex">
              <li className="relative w-1/2 px-1 text-center ">
                <div className="text-4xl md:text-5xl font-playfair-display font-bold text-blue-600 mb-2">{referralReward}</div>
                <div className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">团队收益</div>
              </li>
              <li className="relative w-1/2 px-1 text-center after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:translate-x-px after:w-0.5 after:h-16 after:bg-slate-300 after:hidden sm:after:block last:after:hidden">
                <div className="text-4xl md:text-5xl font-playfair-display font-bold text-blue-600 mb-2">{referralUser}</div>
                <div className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">团队人数</div>
              </li>
            </ul>
            <ul className="flex">
              <li className="relative w-1/2 px-1 text-center after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:translate-x-px after:w-0.5 after:h-16 after:bg-slate-300 after:hidden sm:after:block last:after:hidden">
                <div className="text-4xl md:text-5xl font-playfair-display font-bold text-blue-600 mb-2">{markerReward}</div>
                <div className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">创客收益</div>
              </li>
              <li className="relative w-1/2 px-1 text-center after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:translate-x-px after:w-0.5 after:h-16 after:bg-slate-300 after:hidden sm:after:block last:after:hidden">
                <div className="text-4xl md:text-5xl font-playfair-display font-bold text-blue-600 mb-2">{markerLevel}</div>
                <div className="text-xs sm:text-sm md:text-base text-slate-500 font-medium">创客级别</div>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}