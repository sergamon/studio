'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, Upload, FileImage, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface CameraCaptureProps {
    onCapture: (imageSrc: string) => void;
    label?: string;
    className?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, label, className }) => {
    const { t } = useLanguage();
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // Prefer back camera on mobile
                audio: false,
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsStreaming(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError(t('errors_required') || "Could not access camera. Please check permissions.");
        }
    }, [t]);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsStreaming(false);
        }
    }, [stream]);

    const capture = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageSrc = canvas.toDataURL('image/jpeg', 0.9);
                setCapturedImage(imageSrc);
                onCapture(imageSrc);
                stopCamera();

                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        }
    }, [onCapture, stopCamera]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check file size (10MB limit)
            const MAX_SIZE = 10 * 1024 * 1024;
            if (file.size > MAX_SIZE) {
                setError("El archivo es demasiado grande. El peso máximo es 10MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setCapturedImage(result);
                onCapture(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => {
        setError(null);
        fileInputRef.current?.click();
    };

    const retake = () => {
        setCapturedImage(null);
        setError(null);
        startCamera();
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    return (
        <div className={cn(
            "relative w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-slate-900 aspect-[4/3] flex flex-col items-center justify-center border-2 border-slate-200/20 shadow-xl transition-all duration-300",
            className
        )}>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
            />

            {/* Error State */}
            {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm text-destructive p-6 text-center z-20">
                    <AlertCircle className="w-12 h-12 mb-4" />
                    <p className="font-medium">{error}</p>
                    <div className="flex gap-3 mt-6">
                        <Button onClick={startCamera} variant="default" className="shadow-lg">Try Camera Again</Button>
                        <Button onClick={triggerFileUpload} variant="secondary">
                            <Upload className="w-4 h-4 mr-2" /> {t('upload_file')}
                        </Button>
                    </div>
                </div>
            )}

            {/* Captured State */}
            {capturedImage ? (
                <div className="relative w-full h-full group">
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-contain bg-slate-950" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="flex flex-col gap-3">
                            <Button onClick={retake} variant="secondary" size="lg" className="gap-2 font-medium shadow-xl">
                                <RefreshCw className="w-5 h-5" /> {t('correct')}
                            </Button>
                            <Button onClick={triggerFileUpload} variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2 font-medium">
                                <Upload className="w-5 h-5" /> {t('upload_file')}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                /* Main State: Choose Camera or Upload */
                <>
                    {!isStreaming && !error && (
                        <div className="flex flex-col items-center gap-6 p-8 w-full">
                            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <FileImage className="w-10 h-10" />
                            </div>
                            <h3 className="text-white font-medium text-lg">{label || t('step_id')}</h3>
                            <div className="flex flex-col w-full gap-3">
                                <Button onClick={startCamera} variant="default" size="lg" className="w-full h-14 text-base font-semibold shadow-lg gap-3">
                                    <Camera className="w-6 h-6" /> {t('use_camera')}
                                </Button>
                                <Button onClick={triggerFileUpload} variant="outline" size="lg" className="w-full h-14 text-base font-semibold bg-white/5 text-white border-white/10 hover:bg-white/10 gap-3">
                                    <Upload className="w-6 h-6" /> {t('upload_file')}
                                </Button>
                            </div>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        onLoadedMetadata={() => setIsStreaming(true)}
                        className={cn("absolute inset-0 w-full h-full object-cover", !isStreaming && "hidden")}
                    />

                    {/* Overlay Guide */}
                    {isStreaming && (
                        <div className="absolute inset-0 pointer-events-none z-10">
                            {/* Darkened border to highlight the center */}
                            <div className="absolute inset-0 border-[40px] md:border-[60px] border-black/60"></div>

                            {/* Animated Corner markers */}
                            <div className="absolute top-12 left-12 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-xl animate-pulse"></div>
                            <div className="absolute top-12 right-12 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-xl animate-pulse"></div>
                            <div className="absolute bottom-12 left-12 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-xl animate-pulse"></div>
                            <div className="absolute bottom-12 right-12 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-xl animate-pulse"></div>

                            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8 pointer-events-auto">
                                <Button
                                    onClick={stopCamera}
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60"
                                >
                                    <RefreshCw className="w-6 h-6" />
                                </Button>

                                <Button
                                    onClick={capture}
                                    size="icon"
                                    className="h-20 w-20 rounded-full border-4 border-white bg-transparent hover:bg-white/10 transition-all active:scale-90"
                                >
                                    <div className="w-14 h-14 bg-white rounded-full shadow-inner shadow-black/20"></div>
                                </Button>

                                <Button
                                    onClick={triggerFileUpload}
                                    variant="outline"
                                    size="icon"
                                    className="h-12 w-12 rounded-full bg-black/40 border-white/20 text-white hover:bg-black/60"
                                >
                                    <Upload className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
};

