"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Check, ZoomIn, RotateCcw, Loader2 } from 'lucide-react';

interface ImageCropperProps {
    image: string;
    onClose: () => void;
    onCropSave: (croppedImage: Blob) => void;
}

interface Rect { left: number; top: number; width: number; height: number }
interface Vec2 { x: number; y: number }
interface Size { w: number; h: number }

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

async function exportCrop(
    imgEl: HTMLImageElement,
    base: Rect,
    rendered: Rect,
    rotation: number,
): Promise<Blob | null> {
    const nW = imgEl.naturalWidth;
    const nH = imgEl.naturalHeight;

    // Scale: container-pixel → natural-pixel
    const sx = nW / rendered.width;
    const sy = nH / rendered.height;

    // Output canvas covers exactly the crop frame at full natural resolution
    const outW = Math.round(base.width * sx);
    const outH = Math.round(base.height * sy);

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, outW, outH);
    ctx.save();

    // Map: container-pixel → output-pixel  (origin = crop frame top-left)
    ctx.scale(sx, sy);
    ctx.translate(-base.left, -base.top);

    // Draw image at its rendered position, with rotation around its own center
    const cx = rendered.left + rendered.width / 2;
    const cy = rendered.top + rendered.height / 2;
    ctx.translate(cx, cy);
    if (rotation !== 0) ctx.rotate((rotation * Math.PI) / 180);
    ctx.drawImage(imgEl, -rendered.width / 2, -rendered.height / 2, rendered.width, rendered.height);

    ctx.restore();

    return new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
    });
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onClose, onCropSave }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const [natural, setNatural] = useState<Size>({ w: 1, h: 1 });
    const [cSize, setCSize] = useState<Size>({ w: 0, h: 0 });
    const [imageLoaded, setImageLoaded] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState<Vec2>({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Portal target only exists in the browser
    useEffect(() => { setMounted(true); }, []);

    // Track container dimensions with ResizeObserver.
    // Depends on `mounted` so it (re)attaches after the portal renders the container —
    // otherwise the ref is null on first run and the size stays 0 (image renders at 0×0).
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        // Measure synchronously so the frame is correct on first paint
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) setCSize({ w: rect.width, h: rect.height });
        const ro = new ResizeObserver(([e]) => {
            const { width, height } = e.contentRect;
            setCSize({ w: width, h: height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, [mounted]);

    const onImgLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const el = e.currentTarget;
        setNatural({ w: el.naturalWidth, h: el.naturalHeight });
        setImageLoaded(true);
        setZoom(1);
        setPan({ x: 0, y: 0 });
    }, []);

    // Crop frame: always a 1:1 square, centered in the container
    const side = Math.min(cSize.w, cSize.h);
    const base: Rect = (cSize.w > 0 && imageLoaded)
        ? { left: (cSize.w - side) / 2, top: (cSize.h - side) / 2, width: side, height: side }
        : { left: 0, top: 0, width: 0, height: 0 };

    // Image rect at zoom=1 — sized to "cover" the square frame (no letterboxing)
    const imgBase: Rect = (() => {
        if (base.width === 0) return { left: 0, top: 0, width: 0, height: 0 };
        const scale = side / Math.min(natural.w, natural.h);
        const w = natural.w * scale;
        const h = natural.h * scale;
        return { left: base.left + (side - w) / 2, top: base.top + (side - h) / 2, width: w, height: h };
    })();

    // Current rendered image rect (accounting for zoom and pan)
    const rendered: Rect = {
        left: imgBase.left - (imgBase.width * (zoom - 1)) / 2 + pan.x,
        top: imgBase.top - (imgBase.height * (zoom - 1)) / 2 + pan.y,
        width: imgBase.width * zoom,
        height: imgBase.height * zoom,
    };

    const applyClamp = useCallback(
        (raw: Vec2, z: number): Vec2 => {
            if (base.width === 0) return { x: 0, y: 0 };
            // Keep the image covering the square frame at all times
            const mx = Math.max(0, (imgBase.width * z - base.width) / 2);
            const my = Math.max(0, (imgBase.height * z - base.height) / 2);
            return { x: clamp(raw.x, -mx, mx), y: clamp(raw.y, -my, my) };
        },
        [base.width, imgBase.width, imgBase.height],
    );

    // Pointer-based drag (works for mouse and touch)
    const drag = useRef<{ x0: number; y0: number; px0: number; py0: number } | null>(null);

    const onPtrDown = (e: React.PointerEvent) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x0: e.clientX, y0: e.clientY, px0: pan.x, py0: pan.y };
    };

    const onPtrMove = (e: React.PointerEvent) => {
        if (!drag.current) return;
        setPan(applyClamp(
            { x: drag.current.px0 + e.clientX - drag.current.x0, y: drag.current.py0 + e.clientY - drag.current.y0 },
            zoom,
        ));
    };

    const onPtrUp = () => { drag.current = null; };

    const onZoomChange = (z: number) => {
        setZoom(z);
        setPan(prev => applyClamp(prev, z));
    };

    const handleSave = async () => {
        if (isSaving || !imgRef.current || !imageLoaded || cSize.w === 0) return;
        setIsSaving(true);
        try {
            const blob = await exportCrop(imgRef.current, base, rendered, rotation);
            if (blob) onCropSave(blob);
            else alert('فشل في قص الصورة.\nFailed to crop image.');
        } catch {
            alert('وقع خطأ.\nSomething went wrong.');
        } finally {
            setIsSaving(false);
        }
    };

    const ready = cSize.w > 0 && imageLoaded && base.width > 0;

    if (!mounted) return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 16 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="bg-white rounded-[10px] w-full max-w-md my-auto shadow-2xl shadow-green/10 border border-green/10 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <h3 className="text-base font-black text-dark tracking-tight">قص الصورة</h3>
                    <button
                        onClick={onClose}
                        aria-label="إغلاق"
                        className="w-8 h-8 rounded-full bg-green/8 flex items-center justify-center text-green hover:bg-green/15 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Body: crop stage (left) + horizontal sliders (right) */}
                <div className="px-5 pb-3 flex gap-4 items-center">
                {/* Crop stage */}
                <div
                    ref={containerRef}
                    className="relative aspect-square w-1/2 max-w-[240px] shrink-0 select-none cursor-grab active:cursor-grabbing rounded-[10px] overflow-hidden"
                    style={{ background: '#f0f0f0', touchAction: 'none' }}
                    onPointerDown={onPtrDown}
                    onPointerMove={onPtrMove}
                    onPointerUp={onPtrUp}
                    onPointerCancel={onPtrUp}
                >
                    <img
                        ref={imgRef}
                        src={image}
                        alt=""
                        onLoad={onImgLoad}
                        crossOrigin="anonymous"
                        draggable={false}
                        style={{
                            position: 'absolute',
                            left: rendered.left,
                            top: rendered.top,
                            width: rendered.width,
                            height: rendered.height,
                            maxWidth: 'none',
                            maxHeight: 'none',
                            transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
                            transformOrigin: 'center center',
                            pointerEvents: 'none',
                            userSelect: 'none',
                            willChange: 'transform, left, top',
                        }}
                    />

                    {ready && (
                        <>
                            <div style={{ position: 'absolute', left: 0, top: 0, width: cSize.w, height: base.top, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', left: 0, top: base.top + base.height, width: cSize.w, height: cSize.h - base.top - base.height, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', left: 0, top: base.top, width: base.left, height: base.height, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none' }} />
                            <div style={{ position: 'absolute', left: base.left + base.width, top: base.top, width: cSize.w - base.left - base.width, height: base.height, background: 'rgba(0,0,0,0.45)', pointerEvents: 'none' }} />
                        </>
                    )}

                    {ready && (
                        <div
                            style={{
                                position: 'absolute',
                                left: base.left,
                                top: base.top,
                                width: base.width,
                                height: base.height,
                                boxSizing: 'border-box',
                                border: '1.5px solid rgba(255,255,255,0.85)',
                                pointerEvents: 'none',
                            }}
                        >
                            <div style={{ position: 'absolute', left: '33.33%', top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.25)' }} />
                            <div style={{ position: 'absolute', left: '66.66%', top: 0, width: 1, height: '100%', background: 'rgba(255,255,255,0.25)' }} />
                            <div style={{ position: 'absolute', top: '33.33%', left: 0, width: '100%', height: 1, background: 'rgba(255,255,255,0.25)' }} />
                            <div style={{ position: 'absolute', top: '66.66%', left: 0, width: '100%', height: 1, background: 'rgba(255,255,255,0.25)' }} />
                        </div>
                    )}
                </div>

                {/* Sliders (right of the image) */}
                <div className="flex-1 min-w-0 space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-dark/50">
                            <span className="flex items-center gap-1.5"><ZoomIn size={11} className="text-green" /> Zoom</span>
                            <span className="text-green">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range" value={zoom} min={1} max={3} step={0.05}
                            onChange={(e) => onZoomChange(Number(e.target.value))}
                            className="w-full h-1 bg-green/10 rounded-full appearance-none cursor-pointer accent-green"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-dark/50">
                            <span className="flex items-center gap-1.5"><RotateCcw size={11} className="text-green" /> Rotation</span>
                            <span className="text-green">{rotation}°</span>
                        </div>
                        <input
                            type="range" value={rotation} min={0} max={360} step={1}
                            onChange={(e) => setRotation(Number(e.target.value))}
                            className="w-full h-1 bg-green/10 rounded-full appearance-none cursor-pointer accent-green"
                        />
                    </div>
                </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 pt-2 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 bg-green/5 text-dark/70 font-bold rounded-[10px] hover:bg-green/10 transition-colors text-sm"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 py-2.5 bg-green text-white font-bold rounded-[10px] hover:shadow-xl hover:shadow-green/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                        {isSaving ? '...' : 'حفظ'}
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        document.body,
    );
};

export default ImageCropper;
