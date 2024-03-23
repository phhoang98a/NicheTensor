"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CustomSlider } from './CustomSlider';
import { MdOutlineBurstMode, MdAspectRatio, MdDriveFolderUpload, MdDisplaySettings } from "react-icons/md";
import { TbPrompt, TbBoxModel } from "react-icons/tb";
import { IoMdSettings } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CiCircleQuestion } from "react-icons/ci";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function MobileMenu({ settings, setSettings }) {
  const { feature, model, ratio, negativePrompt, uid, secretKey, seed, fileData, canny, depth, mlsd } = settings;
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSettingsChange = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // The result attribute contains the data URL, which is base64 encoded
        const base64String = event.target.result;
        const fileSize = (file.size / 1024).toFixed(2);
        handleSettingsChange("fileData", { base64String: base64String, name: file.name, size: fileSize })
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const handleFeature = (value) => {
    setSettings({
      feature: value,
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
      prompt: ""
    })
  };

  const removeFile = () => {
    handleSettingsChange("fileData", null);
    fileInputRef.current.value = '';
  };
  return (
    <div>
      <Menubar className="overflow-x-auto overflow-y-hidden pt-[30px] pb-[30px] border-none">
        <MenubarMenu>
          <Drawer>
            <DrawerTrigger className="px-3 flex flex-col items-center">
              <MdOutlineBurstMode size={23} />
              <span className="text-xs whitespace-nowrap mt-1">Feature</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Feature</DrawerTitle>
              </DrawerHeader>
              <div className="grid py-2">
                <RadioGroup value={feature} onValueChange={handleFeature}>
                  <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${feature === 'Text To Image' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                    <RadioGroupItem value="Text To Image" className="checkbox" id="f1" />
                    <Label htmlFor="f1">Text To Image</Label>
                  </div>
                  <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${feature === 'Image To Image' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                    <RadioGroupItem value="Image To Image" id="f2" className="checkbox" />
                    <Label htmlFor="f2">Image To Image</Label>
                  </div>
                  <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${feature === 'Control To Image' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                    <RadioGroupItem value="Control To Image" id="f3" className="checkbox" />
                    <Label htmlFor="f3">Control To Image</Label>
                  </div>
                </RadioGroup>
              </div>
            </DrawerContent>
          </Drawer>
        </MenubarMenu>
        <Separator orientation="vertical" className="mx-4 h-8 bg-gray-300 dark:bg-[rgba(83,83,83,1)]" />
        <MenubarMenu>
          <Drawer>
            <DrawerTrigger className="px-3 flex flex-col items-center">
              <TbBoxModel size={23} />
              <span className="text-xs whitespace-nowrap mt-1">Model</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Model</DrawerTitle>
              </DrawerHeader>
              <div className="grid py-2">
                <RadioGroup value={model} onValueChange={(value) => handleSettingsChange("model", value)}>
                  <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${model === 'DreamShaper' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                    <RadioGroupItem value="DreamShaper" id="m3" className="checkbox" />
                    <Label htmlFor="m3">DreamShaper</Label>
                  </div>
                  {
                    feature == "Text To Speech" && (
                      <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${model === 'RealisticVision' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                        <RadioGroupItem value="RealisticVision" id="m1" className="checkbox" />
                        <Label htmlFor="m1">RealisticVision</Label>
                      </div>
                    )
                  }
                  {
                    feature == "Text To Speech" && (
                      <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${model === 'AnimeV3' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                        <RadioGroupItem value="AnimeV3" id="m2" className="checkbox" />
                        <Label htmlFor="m2">AnimeV3</Label>
                      </div>
                    )
                  }
                  {
                    feature == "Text To Speech" && (
                      <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${model === 'RealitiesEdgeXL' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                        <RadioGroupItem value="RealitiesEdgeXL" id="m4" className="checkbox" />
                        <Label htmlFor="m4">RealitiesEdgeXL</Label>
                      </div>
                    )
                  }
                </RadioGroup>
              </div>
            </DrawerContent>
          </Drawer>
        </MenubarMenu>

        <Separator orientation="vertical" className="mx-4 h-8 bg-gray-300 dark:bg-[rgba(83,83,83,1)]" />

        {feature == "Text To Image" ? (
          <MenubarMenu>
            <Drawer>
              <DrawerTrigger className="px-3 flex flex-col items-center">
                <MdAspectRatio size={23} />
                <span className="text-xs whitespace-nowrap mt-1">Aspect Ratio</span>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Aspect Ratio</DrawerTitle>
                </DrawerHeader>
                <div className="grid py-2">
                  <RadioGroup value={ratio} onValueChange={(value) => handleSettingsChange("ratio", value)}>
                    <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${ratio === 'Tall' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                      <RadioGroupItem value="Tall" id="r1" className="checkbox" />
                      <Label htmlFor="r1">Tall</Label>
                    </div>
                    <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${ratio === 'Wide' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                      <RadioGroupItem value="Wide" id="r2" className="checkbox" />
                      <Label htmlFor="r2">Wide</Label>
                    </div>
                    <div className={`flex items-center pl-10 pt-2 pb-2 space-x-2 ${ratio === 'Square' ? 'bg-gray-100 dark:bg-[rgba(50,50,50,1)]' : ''}`}>
                      <RadioGroupItem value="Square" id="r3" className="checkbox" />
                      <Label htmlFor="r3">Square</Label>
                    </div>
                  </RadioGroup>
                </div>
              </DrawerContent>
            </Drawer>
          </MenubarMenu>
        ) : (
          <>
            <MenubarMenu>
              <Drawer>
                <DrawerTrigger className="px-3 flex flex-col items-center">
                  <MdDriveFolderUpload size={23} />
                  <span className="text-xs whitespace-nowrap mt-1">Upload Image</span>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <div className="flex justify-center items-center">
                      <DrawerTitle>Upload Image</DrawerTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" className="p-0 dark:hover:bg-[rgba(50,50,50,1)]">
                              <CiCircleQuestion size={40} className='p-2' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="whitespace-normal break-words max-w-[300px]">
                            <p>Upload an image to condition the generation</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </DrawerHeader>
                  <div className="p-4">
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="file-input"
                        accept="image/*"
                      />
                    </div>
                    <div className='flex text-xs text-center pl-10 pr-10'>
                      <h1>To get started, select a sample asset or upload an image</h1>
                    </div>
                    <div className='flex justify-center'>
                      <Button className="mt-2 px-4 py-2 rounded-3xl focus:outline-none focus:shadow-outline" onClick={triggerFileSelect}>
                        Upload
                      </Button>
                    </div>
                    {fileData && (
                      <HoverCard>
                        <HoverCardTrigger className='hover:cursor-pointer'>
                          <div className="flex items-center justify-between bg-gray-100 p-2 rounded mt-4">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 w-4 h-4 mr-2 bg-gray-400 rounded-full"></div>
                              <div className="truncate">
                                <div className="text-sm font-medium">{fileData.name.length > 11 ? `${fileData.name.substring(0, 11)}...` : fileData.name}</div>
                                <div className="text-xs text-gray-500">{fileData.size} KB</div>
                              </div>
                            </div>
                            <button onClick={removeFile} className="text-gray-500 hover:text-gray-700">
                              &times;
                            </button>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" sideOffset={4} className="HoverCardContent">
                          <img src={fileData.base64String} alt="" className="w-full h-full object-cover" />
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </DrawerContent>
              </Drawer>
            </MenubarMenu>
            {feature == "Control To Image" && (
              <>
                <Separator orientation="vertical" className="mx-4 h-8 bg-gray-300 dark:bg-[rgba(83,83,83,1)]" />
                <MenubarMenu>
                  <Drawer>
                    <DrawerTrigger className="px-3 flex flex-col items-center">
                      <MdDisplaySettings size={23} />
                      <span className="text-xs whitespace-nowrap mt-1">Conditionings</span>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>Conditionings</DrawerTitle>
                      </DrawerHeader>
                      <div className="grid w-full items-center gap-2">
                        <div className="p-4">
                          <CustomSlider label="Canny Strength" setValue={setSettings} text="Strength of the Canny ControlNet" val={canny} />
                        </div>
                        <div className="p-4">
                          <CustomSlider label="Depth Strength" setValue={setSettings} text="Strength of the Depth ControlNet" val={depth} />
                        </div>
                        <div className="p-4">
                          <CustomSlider label="MLSD Strength" setValue={setSettings} text="Strength of the MLSD ControlNet" val={mlsd} />
                        </div>
                      </div>
                    </DrawerContent>
                  </Drawer>
                </MenubarMenu>
              </>
            )}
          </>
        )}
        <Separator orientation="vertical" className="mx-4 h-8 bg-gray-300 dark:bg-[rgba(83,83,83,1)]" />
        <MenubarMenu>
          <Drawer>
            <DrawerTrigger className="px-3 flex flex-col items-center">
              <TbPrompt size={23} />
              <span className="text-xs whitespace-nowrap mt-1">Negative Prompt</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <div className="flex justify-center items-center">
                  <DrawerTitle>Negative Prompt</DrawerTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" className="p-0 dark:hover:bg-[rgba(50,50,50,1)]">
                          <CiCircleQuestion size={40} className='p-2' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="whitespace-normal break-words max-w-[300px]">
                        <p>This is a negative prompt, basically type what you don't want to see in the generated image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

              </DrawerHeader>
              <div className="mx-2 my-4" ref={textareaRef}>
                <Textarea
                  className="text-xs"
                  value={negativePrompt}
                  onChange={(e) => handleSettingsChange("negativePrompt", e.target.value)}
                  onFocus={() => {
                    if (textareaRef.current) {
                      textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                  }}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </MenubarMenu>
        <Separator orientation="vertical" className="mx-4 h-8 bg-gray-300 dark:bg-[rgba(83,83,83,1)]" />
        <MenubarMenu>
          <Drawer>
            <DrawerTrigger className="px-3 flex flex-col items-center">
              <IoMdSettings size={23} />
              <span className="text-xs whitespace-nowrap mt-1">Advanced Settings</span>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Advanced Settings</DrawerTitle>
              </DrawerHeader>
              <div className="mx-2 my-4">
                <Label className="text-xs">Specify an UID</Label>
                <Textarea className="text-xs" value={uid} onChange={(e) => handleSettingsChange("uid", e.target.value)} />
                <Label className="text-xs">Enter secret key</Label>
                <Textarea className="text-xs" onChange={(e) => handleSettingsChange("secretKey", e.target.value)} />
                <Label className="text-xs">Seed</Label>
                <Textarea className="text-xs" value={seed} onChange={(e) => handleSettingsChange("seed", e.target.value)} />
              </div>
            </DrawerContent>
          </Drawer>
        </MenubarMenu>
      </Menubar>

    </div>
  )
}
