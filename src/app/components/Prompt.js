"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RiAiGenerate } from "react-icons/ri";
import { motion } from "framer-motion";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { RocketIcon } from "@radix-ui/react-icons"
import { Loader2 } from 'lucide-react';

export default function Prompt({ settings, setSettings }) {
  const { feature, model, ratio, negativePrompt, uid, secretKey, seed, fileData, canny, depth, mlsd, prompt, isGenerating } = settings;
  const RATIO_CONFIG = {
    "SD": { "Tall": [768, 432], "Square": [512, 512], "Wide": [512, 640] },
    "SDXL": { "Tall": [1024, 576], "Square": [1024, 1024], "Wide": [768, 960] }
  }
  const MODEL_CONFIG = {
    "DreamShaper": {
      "model_type": "SD",
      "num_inference_steps": 30,
    },
    "RealisticVision": {
      "model_type": "SD",
      "num_inference_steps": 30,
    },
    "AnimeV3": {
      "model_type": "SDXL",
      "num_inference_steps": 30,
    },
    "RealitiesEdgeXL": {
      "model_type": "SD",
      "num_inference_steps": 8,
    },
  }
  const [showAlert, setShowAlert] = useState(false);
  const handleSettingsChange = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000); // Adjust the duration as needed (in milliseconds)

      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const runPrompt = async () => {
    if (fileData || feature == "Text To Image") {
      handleSettingsChange("isGenerating", true);
      handleSettingsChange("gImages", []);
      let data;
      let type;
      if (feature === "Text To Image") {
        type = "txt2img"
      } else if (feature === "Image To Image") {
        type = "img2img"
      } else {
        type = "controlnet_txt2img"
      }
      let key = secretKey
      if (secretKey === "") {
        key = "capricorn_feb"
      }

      if (type === "txt2img") {
        const [height, width] = RATIO_CONFIG[MODEL_CONFIG[model]["model_type"]][ratio];
        data = {
          "key": key,
          "model_name": model,
          "prompt": prompt,
          "seed": 0,
          "miner_uid": parseInt(uid),
          "pipeline_type": type,
          "pipeline_params": {
            "width": width,
            "height": height,
            "negative_prompt": negativePrompt,
            "num_inference_steps": MODEL_CONFIG[model]["num_inference_steps"]
          }
        };
      } else {
        const base64Image = fileData.base64String.split(",")[1]
        const controlnetConditioningScale = type === "img2img" ? [] : [canny / 100, depth / 100, mlsd / 100]
        data = {
          "key": key,
          "model_name": model,
          "prompt": prompt,
          "seed": 0,
          "miner_uid": parseInt(uid),
          "pipeline_type": type,
          "conditional_image": base64Image,
          "pipeline_params": {
            "negative_prompt": negativePrompt,
            "controlnet_conditioning_scale": controlnetConditioningScale,
            "num_inference_steps": MODEL_CONFIG[model]["num_inference_steps"]
          }
        };
      }

      try {
        const promises = [];
        for (let i = 0; i <= 3; i++) {
          if (parseInt(seed) >= 0) {
            data["seed"] = parseInt(seed) + i
          } else {
            data["seed"] = getRandomInt(0, 1e9);
          }
          promises.push(
            fetch("/api/generate", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
          );
        }
        const responses = await Promise.all(promises);
        const newImages = await Promise.all(responses.map(response => response.json()));

        setSettings(prevSettings => ({
          ...prevSettings,
          gImages: [...prevSettings.gImages, ...newImages.map(imageData => `data:image/png;base64,${imageData}`)],
        }));
        handleSettingsChange("isGenerating", false);
      } catch (error) {
        console.log(error)
      }
    } else {
      setShowAlert(true)
    }
  }

  const handlePrompt = async () => {
    await runPrompt()
  }
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex items-center w-11/12 sm:w-4/5 bg-white border-2 dark:bg-[rgba(29,29,29,1)] rounded-3xl" style={{ height: "100px" }} >
          <Textarea
            className="flex-grow px-4 text-[0.74rem] rounded-l-3xl sm:text-sm resize-none border-none focus:outline-none focus:ring-0"
            placeholder="Describe the image you want to generate"
            onChange={(e) => handleSettingsChange("prompt", e.target.value)}
            value={prompt}
          />
          <div className="pl-3 pr-4">
            <motion.div
              className="box"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                className="font-bold py-2 px-4 text-xs sm:text-sm rounded-3xl sm:rounded-2xl flex items-center justify-center "
                style={{ backgroundColor: "rgba(2, 101, 220)" }}
                disabled={prompt === "" || isGenerating ? true : false}
                onClick={handlePrompt}
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> :
                  <>
                    <RiAiGenerate size={20} />
                    <div className='ml-2 hidden sm:block'>
                      Try Prompt
                    </div>
                  </>
                }
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
      {showAlert && (
        <div className='fixed bottom-4 right-4 animate-fade-out'>
          <Alert className="bg-white dark:bg-[rgba(29,29,29,1)] rounded-xl ">
            <RocketIcon className="h-4 w-4" />
            <AlertTitle>Hint!</AlertTitle>
            <AlertDescription>
              Image upload required for the next step in our process
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}