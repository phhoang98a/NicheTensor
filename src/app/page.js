"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Presentation from "./components/Presentation";
import { Menu } from "./components/Menu";
import Prompt from './components/Prompt';
import { MobileMenu } from './components/MobileMenu';

export default function Home() {
  const [settings, setSettings] = useState({
    feature: "Text To Image",
    model: "DreamShaper",
    ratio: "Tall",
    negativePrompt: "low quality, blurry, pixelated, noisy, low resolution, defocused, out of focus, overexposed, bad image, nsfw",
    uid: "-1",
    secretKey: "",
    seed: "-1",
    fileData: null,
    canny: 50,
    depth: 50,
    mlsd: 50,
    gImages: [],
    isGenerating: false,
    prompt:""
  })

  return (

    <div className="flex flex-col sm:flex-row flex-grow sm:overflow-hidden ">
      <div className="sm:w-1/4 order-2 sm:order-1 hidden sm:block bg-gray-100 dark:bg-[rgba(50,50,50,1)]">
        <Menu settings={settings} setSettings={setSettings} />
      </div>
      <div className="sm:w-3/4 flex flex-col order-1 sm:order-2 bg-gray-100 dark:bg-[rgba(50,50,50,1)] sm:min-h-0 min-h-screen  ">
        <div className="flex-grow overflow-y-auto ">
          <Presentation settings={settings} setSettings={setSettings} />
        </div>
        <div className="block sm:hidden fixed bottom-0 left-0 right-0">
          <Prompt settings={settings} setSettings={setSettings} />
          <MobileMenu settings={settings} setSettings={setSettings} />
        </div>
      </div>
    </div>


  );
}
