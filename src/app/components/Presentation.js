
"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import Prompt from './Prompt';
import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import { Button } from '@/components/ui/button';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const CustomLabel = ({ label, link }) => {
  return (
    <div className="mx-auto p-2 mb-3 rounded-lg shadow">
      <h2 className="text-xl font-semibold">
        👩🏾‍🍳 {label}
        {
          link.length > 0 ? (
            <>
              -
              <a
                href={link}
                className=" underline underline-offset-1 hover:cursor-pointer" target="_blank" rel="noopener noreferrer">
                CivitAI
              </a>
            </>
          ) : ""
        }
      </h2>
    </div>
  )
}

const CustomCard = ({ images }) => {
  return (
    <Card className="mb-10">
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          {images.map((image, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <img src={image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Presentation({ settings, setSettings }) {
  const { feature, gImages, isGenerating } = settings;
  const realisticImages = [
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/401d2674-e1f8-4976-a615-36110d0b76b3/original=true/ref-res-1.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d2050c06-e916-4091-857a-66bdafcaf6d9/original=true/00029-913302605.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0012d0e9-6d77-4981-b16e-13ac9f3eeb53/original=true/00011-836818560.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/088542b8-00dc-4135-8115-f2086ebb4ffb/original=true/06772-2405195618-HDR,UHD,8K,Highly%20detailed,best%20quality,masterpiece,_lora_catman_0.8_,maomi,blurry%20background,blurry,sunglasses,hat,hands%20in%20poc.jpeg",
  ]

  const dreamImages = [
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/af837eea-2ccc-4801-b916-75ecb270c382/original=true/71584-4007479174-masterpiece,%20a%20dinosaur%20(in%20the%20museum_1.2),%20background%20is%20museum%20exhibition,%20(art%20by%20YRAX_1.1),%20saturated%20colors,%20concept%20art,.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/77940ee3-062a-4d2b-95c4-52c69b79fffd/original=true/00524-2430470379.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/1649bcd9-4417-4c83-97f8-674373b67d61/original=true/42445-1548916933-wabstyle,%20monochrome,%20_lora_wabstyle_1_%20a%20dog.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/09264ecb-38c6-42ed-a2f7-a7ab5ab662fb/original=true/00262-5775713%20-%20Kopie.jpeg",
  ]

  const animeImages = [
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c788e346-7af1-4135-928a-c944634a4a51/original=true/Soldier.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/dc86e78e-7587-45b8-b709-b6f611af68fa/original=true/pirate%20(3).jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/cb6aa6c4-6cd6-4efd-84a8-4b3917ca4d24/original=true/00000-1761366536.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/61cad059-f9d8-446f-b33d-b22e078ac5fb/original=true/Scream.jpeg",
  ]

  const realityImages = [
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7ae8de93-3634-4fb2-acb6-7ba66a630670/original=true/00044-3526680654.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/d7a3e977-5433-46d0-82ba-4946386bd28e/original=true/00135-1518921975.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/c3852385-4c73-4821-ac6f-b9f0323c7d6f/original=true/08323--3358745561.jpeg",
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/7f6be0cf-4b58-4c16-aa8f-4c396fb135b2/original=true/ComfyUI-1-_01583_.jpeg",
  ]

  const downloadImage = (url, filename) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename || 'download';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const downloadImagesAsZip = async () => {
    const zip = new JSZip();

    // Loop through each image URL
    for (let i = 0; i < gImages.length; i++) {
      const url = gImages[i];
      const filename = `Image-${i + 1}.jpg`; // Or dynamically generate filename based on your preference

      try {
        const response = await fetch(url);
        const blob = await response.blob();

        // Add image blob to zip
        zip.file(filename, blob);
      } catch (error) {
        console.error("Error adding file to zip:", error);
      }
    }

    // Generate zip file and trigger download
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'images.zip');
    });
  };

  return (
    <div className="p-8 h-full overflow-y-auto">

      {
        isGenerating ? (
          <>
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
              👩🏾‍🍳 Whipping up your words into art...
            </div>
            
          </>
        ) : (
          <>
            {
              gImages.length > 0 ? (
                <div className="mb-10 pb-[100px] sm:pb-0">
                  <Card className="mb-6">
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
                        {gImages.map((image, index) => (
                          <motion.div
                            key={index} // The key should be on the root element of the map
                            className="relative border rounded-xl overflow-hidden" // Use relative to position children absolutely
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <img src={image} alt={`Image ${index}`} className="w-full h-full object-cover" />
                            <motion.div
                              className="absolute top-0 left-0 w-full h-full flex justify-start items-start" // This div covers the image and contains the button
                              initial={{ opacity: 0 }} // Initially invisible
                              whileHover={{ opacity: 1 }} // Fully opaque on hover
                              transition={{ duration: 0.2 }}
                            >
                              <button
                                onClick={() => downloadImage(image, `Image-${index}.jpg`)}
                                className="m-2 p-2 flex items-center bg-white text-black hover:bg-gray-100 dark:bg-[rgba(29,29,29,1)] dark:text-white dark:hover:bg-[rgba(50,50,50,1)]  
                                rounded-full text-sm focus:outline-none" // Style your button
                              >
                                <FiDownload className='mr-2' /> Download
                              </button>
                            </motion.div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <div className='flex justify-center'>
                    <Button onClick={() => downloadImagesAsZip()}>Download All Images</Button>
                  </div>
                </div>
              ) : (
                <>
                  {
                    feature == "Text To Image" && (
                      <>
                        <div className='w-full'>
                          <CustomLabel label="Realistic Vision Style" link="https://civitai.com/models/4201/realistic-vision-v60-b1" />
                          <CustomCard images={realisticImages} />
                          <CustomLabel label="DreamShaper Style" link="https://civitai.com/models/4384/dreamshaper" />
                          <CustomCard images={dreamImages} />
                          <CustomLabel label="AnimeV3 Style" link="https://civitai.com/models/146113/newdream-sdxl" />
                          <CustomCard images={animeImages} />
                          <CustomLabel label="RealitiesEdgeXL Style" link="https://civitai.com/models/129666?modelVersionId=356472" />
                          <CustomCard images={realityImages} />
                        </div>
                      </>
                    )
                  }
                  {
                    feature == "Image To Image" && (
                      <>
                        <div className='w-full'>
                          <div className="mx-auto p-2 mb-3 rounded-lg shadow">
                            <h2 className="text-xl font-semibold">
                              🎨 Upload your image and imagine the possibilities!
                            </h2>
                          </div>
                          <Card className="mb-10">
                            <CardContent>
                              <div className="flex justify-center items-center p-2">
                                <div className="border rounded overflow-hidden flex justify-center items-center">
                                  <img src="https://preview.redd.it/using-crude-drawings-for-composition-img2img-v0-v7adchf52oha1.jpg?auto=webp&s=1251ed1c567a04ec0cf17fe257fbac01b2d903bd" alt="" className="w-full h-full" /> {/* Adjust w-64 and h-64 as needed */}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )
                  }
                  {
                    feature == "Control To Image" && (
                      <>
                        <div className='w-full'>
                          <CustomLabel label="Canny Edge" link="" />
                          <Card className="mb-10">
                            <CardContent>
                              <div className="flex justify-center items-center p-2">
                                <div className="border rounded overflow-hidden flex justify-center items-center">
                                  <img src="https://huggingface.co/takuma104/controlnet_dev/resolve/main/gen_compare/control_images/converted/control_bird_canny.png" alt="" className="w-full h-full" /> {/* Adjust w-64 and h-64 as needed */}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <CustomLabel label="Depth Map" link="" />
                          <Card className="mb-10">
                            <CardContent>
                              <div className="flex justify-center items-center p-2">
                                <div className="border rounded overflow-hidden flex justify-center items-center">
                                  <img src="https://huggingface.co/takuma104/controlnet_dev/resolve/main/gen_compare/control_images/converted/control_vermeer_depth.png" alt="" className="w-full h-full" /> {/* Adjust w-64 and h-64 as needed */}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <CustomLabel label="MLSD" link="" />
                          <Card className="mb-10">
                            <CardContent>
                              <div className="flex justify-center items-center p-2">
                                <div className="border rounded overflow-hidden flex justify-center items-center">
                                  <img src="https://huggingface.co/takuma104/controlnet_dev/resolve/main/gen_compare/control_images/converted/control_room_mlsd.png" alt="" className="w-full h-full" /> {/* Adjust w-64 and h-64 as needed */}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </>
                    )
                  }
                </>
              )
            }
            <div className="sticky bottom-0 hidden sm:block">
              <Prompt settings={settings} setSettings={setSettings} />
            </div>
          </>
        )
      }
    </div>

  );
}