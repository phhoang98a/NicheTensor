"use client"
import React, { useCallback, useRef } from 'react';

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CustomSlider } from './CustomSlider';
import { Separator } from "@/components/ui/separator"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CiCircleQuestion } from "react-icons/ci";


export function Menu({ settings, setSettings }) {
  const { feature, model, ratio, negativePrompt, uid, secretKey, seed, fileData, canny, depth, mlsd } = settings;
  const fileInputRef = useRef(null);

  const handleSettingsChange = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, []);

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

  const removeFile = () => {
    handleSettingsChange("fileData", null);
    fileInputRef.current.value = '';
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
      prompt:""
    })
  };

  const handleModel = (value) => {
    handleSettingsChange("model", value)
  };

  const handelRatio = (value) => {
    handleSettingsChange("ratio", value)
  };

  const handleNegativePrompt = (e) => {
    handleSettingsChange("negativePrompt", e.target.value)
  }
  return (
    <div className="p-8 flex h-full">
      <Card className="w-full border-2 overflow-y-auto dark:bg-[rgba(29,29,29,1)]">
        <CardHeader>
          <CardTitle>NicheTenrsor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5 gap-y-5">
              <Label>Feature</Label>
              <Select id="feature" defaultValue="Text To Image" onValueChange={handleFeature}>
                <SelectTrigger>
                  <SelectValue placeholder={feature}>{feature}</SelectValue>
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Text To Image" >Text To Image</SelectItem>
                  <SelectItem value="Image To Image">Image To Image</SelectItem>
                  <SelectItem value="Control To Image" >Control To Image</SelectItem>
                </SelectContent>
              </Select>
              <Separator className="my-4" />
              <Label>Select Model</Label>
              <Select id="model" defaultValue="DreamShaper" onValueChange={handleModel}>
                <SelectTrigger
                  style={{
                    backgroundImage: model === 'DreamShaper'
                      ? `url(https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/77940ee3-062a-4d2b-95c4-52c69b79fffd/original=true/00524-2430470379.jpeg)`
                      : model === 'RealisticVision'
                        ? `url(https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/401d2674-e1f8-4976-a615-36110d0b76b3/original=true/ref-res-1.jpeg)`
                        : model === 'AnimeV3'
                          ? `url(https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cb6aa6c4-6cd6-4efd-84a8-4b3917ca4d24/original=true/00000-1761366536.jpeg)`
                          : 'url(https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c3852385-4c73-4821-ac6f-b9f0323c7d6f/original=true/08323--3358745561.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: "center 40%",
                    backgroundRepeat: 'no-repeat',
                    height: "100px"

                  }}
                  className='font-bold text-white'
                >
                  <SelectValue placeholder={model}>{model}</SelectValue>
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="DreamShaper">DreamShaper</SelectItem>
                  {
                    feature == "Text To Image" && (<SelectItem value="RealisticVision">RealisticVision</SelectItem>)
                  }
                  {
                    feature == "Text To Image" && (<SelectItem value="AnimeV3">AnimeV3</SelectItem>)
                  }
                  {
                    feature == "Text To Image" && (<SelectItem value="RealitiesEdgeXL">RealitiesEdgeXL</SelectItem>)
                  }
                </SelectContent>
              </Select>

              {feature === 'Text To Image' ? (
                <>
                  <Separator className="my-4" />
                  <Label>Aspect Ratio</Label>
                  <Select id="ratio" defaultValue='Tall' onValueChange={handelRatio}>
                    <SelectTrigger>
                      <SelectValue placeholder={ratio} >{ratio}</SelectValue>
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Tall">Tall</SelectItem>
                      <SelectItem value="Wide">Wide</SelectItem>
                      <SelectItem value="Square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <Label>Upload Image</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" className="p-0 dark:hover:bg-[rgba(50,50,50,1)]">
                            <CiCircleQuestion size={40} className='p-2' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Upload an image to condition the generation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="border-dashed border-4 border-gray-300 p-4 w-full overflow-hidden">
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="border-2 border-gray-200 h-40 flex justify-center items-center font-bold text-white"
                      style={{
                        backgroundImage: `url(https://firefly.adobe.com/imgs/gallery-background.d03cdb5f.webp)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      <div>
                        <p>Drag and drop file </p>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                          id="file-input"
                          accept="image/*"
                        />
                      </div>
                    </div>
                    <Button className="mt-2 px-4 py-2 focus:outline-none focus:shadow-outline" onClick={triggerFileSelect}>
                      Upload File
                    </Button>
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
                  {
                    feature === 'Control To Image' && (
                      <>
                        <Separator className="my-4" /><Card>
                          <CardContent>
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

                          </CardContent>
                        </Card>
                      </>
                    )
                  }
                </>
              )}
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <Label>Negative Prompt</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" className="p-0 dark:hover:bg-[rgba(50,50,50,1)]">
                        <CiCircleQuestion size={40} className='p-2' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This is a negative prompt, basically type what you don't want to see in the generated image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Textarea value={negativePrompt} onChange={handleNegativePrompt} />
              <Separator className="my-4" />
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Advanced</AccordionTrigger>
                  <AccordionContent>
                    <Label>Specify an UID</Label>
                    <Textarea value={uid} onChange={(e) => handleSettingsChange("uid", e.target.value)} />
                    <Label>Enter secret key</Label>
                    <Textarea onChange={(e) => handleSettingsChange("secretKey", e.target.value)} />
                    <Label>Seed</Label>
                    <Textarea value={seed} onChange={(e) => handleSettingsChange("seed", e.target.value)} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  )
}
