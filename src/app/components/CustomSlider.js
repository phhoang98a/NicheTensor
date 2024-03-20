"use client"
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CiCircleQuestion } from "react-icons/ci";
import { Button } from "@/components/ui/button"

export const CustomSlider = ({ label, setValue, text, val }) => {
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

  const getLabelPosition = (value) => {
    const newValue = Number((value / 100).toFixed(2));
    const newPosition = sliderWidth * newValue;
    return newPosition;
  };

  const handleSettingsChange = (attribute, value) => {
    setValue((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };

  const handleSlider = (newState) => {
    if (label.includes("Canny")) {
      handleSettingsChange("canny", newState)
    } else if (label.includes("Depth")) {
      handleSettingsChange("depth", newState)
    } else {
      handleSettingsChange("mlsd", newState)
    }

  }

  return (
    <div className="relative flex flex-col space-y-1.5 gap-y-5 text-xs">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="p-0 dark:hover:bg-[rgba(50,50,50,1)]">
                <CiCircleQuestion size={40} className='p-2' />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{text}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Slider
        ref={sliderRef}
        defaultValue={[val]}
        max={100}
        step={1}
        onValueChange={(value) => handleSlider(value)}
      />
      <div
        className="absolute bg-red-100 text-red-600 rounded-full px-2"
        style={{
          left: `${getLabelPosition(val)}px`,
          transform: 'translateX(-50%)',
          top: '30px',
        }}
      >
        {val / 100}
      </div>
    </div>
  )
}