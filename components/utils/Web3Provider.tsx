"use client"

import { WagmiConfig, createConfig,configureChains } from "wagmi";
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from "connectkit";
import { mainnet, polygon, optimism, arbitrum,bsc, bscTestnet,hardhat, localhost } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import MyCustomAvatar from "./MyCustomAvatar";
// import { alchemyProvider } from 'wagmi/providers/alchemy'
// import { publicProvider } from 'wagmi/providers/public'
// import { InjectedConnector } from 'wagmi/connectors/injected'

// const { chains, publicClient } = configureChains(
// [bsc, bscTestnet,hardhat],
// [alchemyProvider({ apiKey: 'yourAlchemyApiKey' }), publicProvider()],
// )

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[hardhat,bsc,bscTestnet,localhost,mainnet],
	[publicProvider()],
  )
const config = createConfig(
	getDefaultConfig({
	  // Required API Keys
	  alchemyId: process.env.ALCHEMY_ID, // or infuraId
	  walletConnectProjectId: "123",//process.env.WALLETCONNECT_PROJECT_ID,
	  autoConnect:true,
	  chains,
	  publicClient,
	  webSocketPublicClient,
	  // Required
	  appName: "TCP",
  
	  // Optional
	  appDescription: "Your App Description",
	  
	  appUrl: "https://tcpgolbal.github.io/", // your app's url
	  appIcon: "https://tcpgolbal.github.io/icon.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
	}),
  );

const Web3Provider = ({
	children,
  }: {
	children: React.ReactNode
  }) => {
	
	return (
		<WagmiConfig config={config}>
			<ConnectKitProvider mode="auto" 
				theme="rounded"

				options={{
					language: "zh-CN",
					customAvatar: MyCustomAvatar,
				}}>
				{children}
			</ConnectKitProvider>
		</WagmiConfig>
	)
}

export default Web3Provider
