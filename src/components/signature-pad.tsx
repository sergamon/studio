"use client"

import { useRef, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/use-language"

interface SignaturePadProps {
  fieldName: string
}

export function SignaturePad({ fieldName }: SignaturePadProps) {
  const { setValue, formState: { errors } } = useFormContext()
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)

  const getCoordinates = (event: MouseEvent | TouchEvent) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    if (event instanceof MouseEvent) {
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }
    if (event.touches && event.touches.length > 0) {
      return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
    }
  };

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const coords = getCoordinates(event.nativeEvent);
    if (coords && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.beginPath();
        context.moveTo(coords.x, coords.y);
        setIsDrawing(true);
      }
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing) return;
    const coords = getCoordinates(event.nativeEvent);
    if (coords && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.lineTo(coords.x, coords.y);
        context.stroke();
        setHasSigned(true);
      }
    }
  };

  const stopDrawing = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.closePath();
        setIsDrawing(false);
        if (hasSigned) {
          setValue(fieldName, canvasRef.current.toDataURL("image/png"), { shouldValidate: true });
        }
      }
    }
  };

  const clearSignature = () => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setValue(fieldName, "", { shouldValidate: true });
        setHasSigned(false);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        // For higher resolution displays
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        context.scale(ratio, ratio);
        
        context.strokeStyle = "#000000";
        context.lineWidth = 2;
        context.lineCap = "round";
      }
    }
  }, []);

  const hasError = !!errors[fieldName];

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={cn(
          "w-full h-48 bg-gray-100 rounded-md border-2 border-dashed",
          hasError ? "border-destructive" : "border-border"
        )}
      />
      <div className="mt-2 flex justify-end">
        <Button type="button" variant="ghost" onClick={clearSignature}>
          {t('clear_signature')}
        </Button>
      </div>
    </div>
  );
}
