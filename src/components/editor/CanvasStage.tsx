"use client";

import type Konva from "konva";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Group,
  Image as KonvaImage,
  Layer,
  Rect,
  Stage,
  Text as KonvaText,
  Transformer,
} from "react-konva";
import { resolveYearPlaceholders } from "@/data/eto";
import { getStampById, stampToDataUrl } from "@/data/stamps";
import { getCanvasDimensions } from "@/lib/geometry";
import { renderStyledImageCanvas } from "@/lib/imageEffects";
import { layoutVerticalText } from "@/lib/verticalText";
import { useEditorStore } from "@/stores/editorStore";
import type {
  BackgroundPattern,
  ImageElement,
  StampElement,
  TextElement,
} from "@/types/card";

interface CanvasStageProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

function createPatternCanvas(pattern: BackgroundPattern): HTMLCanvasElement | null {
  if (pattern === "none" || typeof document === "undefined") return null;

  const size = pattern === "washi" ? 120 : 80;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  if (pattern === "washi") {
    ctx.strokeStyle = "rgba(180, 160, 130, 0.35)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 42; i++) {
      const x = (i * 37) % size;
      const y = (i * 53) % size;
      const len = 10 + (i % 16);
      const angle = (i * 0.8) % Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    return canvas;
  }

  if (pattern === "ichimatsu") {
    ctx.fillStyle = "rgba(190, 140, 90, 0.32)";
    const half = size / 2;
    ctx.fillRect(0, 0, half, half);
    ctx.fillRect(half, half, half, half);
    return canvas;
  }

  if (pattern === "asanoha") {
    ctx.strokeStyle = "rgba(175, 135, 80, 0.45)";
    ctx.lineWidth = 1.2;
    const h = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.moveTo(h, 0);
    ctx.lineTo(h, size);
    ctx.moveTo(0, h);
    ctx.lineTo(size, h);
    ctx.stroke();
    return canvas;
  }

  // seigaiha
  ctx.strokeStyle = "rgba(22, 94, 131, 0.35)";
  ctx.lineWidth = 1.4;
  for (let r = 12; r <= 36; r += 12) {
    ctx.beginPath();
    ctx.arc(size / 2, size, r, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, size / 2, r, Math.PI, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(size, size / 2, r, Math.PI, 0);
    ctx.stroke();
  }
  return canvas;
}

function StyledImageNode({
  element,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: {
  element: ImageElement;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}) {
  const [loadedImg, setLoadedImg] = useState<HTMLImageElement | null>(null);
  const imageNodeRef = useRef<Konva.Image | null>(null);

  useEffect(() => {
    let active = true;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (active) setLoadedImg(img);
    };
    img.src = element.src;
    return () => {
      active = false;
    };
  }, [element.src]);

  const styledCanvas = useMemo(() => {
    if (!loadedImg) return null;
    return renderStyledImageCanvas(loadedImg, element);
  }, [loadedImg, element]);

  useEffect(() => {
    if (styledCanvas && imageNodeRef.current) {
      imageNodeRef.current.getLayer()?.batchDraw();
    }
  }, [styledCanvas]);

  if (!styledCanvas) return null;

  return (
    <KonvaImage
      ref={imageNodeRef}
      id={element.id}
      image={styledCanvas}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      opacity={element.opacity}
      visible={element.visible}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
}

function StampNode({
  element,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: {
  element: StampElement;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const stampDef = getStampById(element.stampId);
  const dataUrl = useMemo(() => {
    if (!stampDef) return "";
    return stampToDataUrl(stampDef, element.color, element.secondaryColor);
  }, [stampDef, element.color, element.secondaryColor]);

  useEffect(() => {
    if (!dataUrl) return;
    let active = true;
    const image = new window.Image();
    image.onload = () => {
      if (active) setImg(image);
    };
    image.src = dataUrl;
    return () => {
      active = false;
    };
  }, [dataUrl]);

  if (!img) return null;

  return (
    <KonvaImage
      id={element.id}
      image={img}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      opacity={element.opacity}
      visible={element.visible}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    />
  );
}

function TextNode({
  element,
  year,
  onSelect,
  onDragEnd,
  onTransformEnd,
}: {
  element: TextElement;
  year: number;
  onSelect: () => void;
  onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd: (e: Konva.KonvaEventObject<Event>) => void;
}) {
  const resolvedText = useMemo(
    () => resolveYearPlaceholders(element.text, year),
    [element.text, year]
  );

  const verticalGlyphs = useMemo(() => {
    if (element.writingMode !== "vertical") return [];
    return layoutVerticalText({
      text: resolvedText,
      boxWidth: element.width,
      fontSize: element.fontSize,
      letterSpacing: element.letterSpacing,
      lineHeight: element.lineHeight,
      tateChuYoko: element.tateChuYoko,
    });
  }, [
    element.writingMode,
    resolvedText,
    element.width,
    element.fontSize,
    element.letterSpacing,
    element.lineHeight,
    element.tateChuYoko,
  ]);

  if (element.writingMode === "horizontal") {
    return (
      <KonvaText
        id={element.id}
        text={resolvedText}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        rotation={element.rotation}
        opacity={element.opacity}
        visible={element.visible}
        fontFamily={element.fontFamily}
        fontSize={element.fontSize}
        fontStyle={element.fontWeight}
        fill={element.color}
        letterSpacing={element.letterSpacing}
        lineHeight={element.lineHeight}
        align={element.align}
        stroke={element.strokeWidth > 0 ? element.strokeColor : undefined}
        strokeWidth={element.strokeWidth}
        fillAfterStrokeEnabled
        shadowEnabled={element.shadowEnabled}
        shadowColor={element.shadowColor}
        shadowBlur={10}
        shadowOffset={{ x: 3, y: 3 }}
        draggable={!element.locked}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={onDragEnd}
        onTransformEnd={onTransformEnd}
      />
    );
  }

  return (
    <Group
      id={element.id}
      x={element.x}
      y={element.y}
      width={element.width}
      height={element.height}
      rotation={element.rotation}
      opacity={element.opacity}
      visible={element.visible}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    >
      {/* ドラッグ・選択用の透明ヒット領域 */}
      <Rect width={element.width} height={element.height} fill="transparent" />
      {verticalGlyphs.map((g, idx) => (
        <KonvaText
          key={`${idx}-${g.char}`}
          text={g.char}
          x={g.x}
          y={g.y}
          fontFamily={element.fontFamily}
          fontSize={element.fontSize}
          fontStyle={element.fontWeight}
          fill={element.color}
          rotation={g.rotation}
          scaleX={g.scaleX}
          scaleY={g.scaleY}
          offsetX={
            g.isTateChuYoko
              ? (element.fontSize * g.char.length * 0.55) / 2
              : element.fontSize * 0.5
          }
          offsetY={element.fontSize * 0.5}
          stroke={element.strokeWidth > 0 ? element.strokeColor : undefined}
          strokeWidth={element.strokeWidth}
          fillAfterStrokeEnabled
          shadowEnabled={element.shadowEnabled}
          shadowColor={element.shadowColor}
          shadowBlur={8}
          shadowOffset={{ x: 2, y: 2 }}
          listening={false}
        />
      ))}
    </Group>
  );
}

export function CanvasStage({ stageRef }: CanvasStageProps) {
  const {
    year,
    orientation,
    background,
    elements,
    selectedId,
    zoom,
    showGuides,
    showBleed,
    selectElement,
    updateElement,
  } = useEditorStore();

  const transformerRef = useRef<Konva.Transformer | null>(null);
  const dims = getCanvasDimensions(orientation);
  const [patternImage, setPatternImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = createPatternCanvas(background.pattern);
    if (!canvas) {
      setPatternImage(null);
      return;
    }
    let active = true;
    const img = new window.Image();
    img.onload = () => {
      if (active) setPatternImage(img);
    };
    img.src = canvas.toDataURL();
    return () => {
      active = false;
    };
  }, [background.pattern]);

  useEffect(() => {
    const tr = transformerRef.current;
    const stage = stageRef.current;
    if (!tr || !stage) return;

    if (!selectedId) {
      tr.nodes([]);
      tr.getLayer()?.batchDraw();
      return;
    }

    const selectedNode = stage.findOne(`#${selectedId}`);
    const selectedEl = elements.find((el) => el.id === selectedId);
    if (selectedNode && selectedEl && !selectedEl.locked) {
      tr.nodes([selectedNode]);
    } else {
      tr.nodes([]);
    }
    tr.getLayer()?.batchDraw();
  }, [selectedId, elements, stageRef]);

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (e.target === e.target.getStage() || e.target.name() === "bg-layer-rect") {
      selectElement(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-stone-200/80 flex items-center justify-center p-6 min-h-[540px]">
      <div
        className="shadow-2xl ring-1 ring-black/10 bg-white relative"
        style={{
          width: dims.width * zoom,
          height: dims.height * zoom,
        }}
      >
        <Stage
          ref={stageRef}
          width={dims.width * zoom}
          height={dims.height * zoom}
          scaleX={zoom}
          scaleY={zoom}
          onMouseDown={handleStageMouseDown}
          onTouchStart={handleStageMouseDown}
        >
          <Layer>
            {/* 背景色 / グラデーション */}
            {background.type === "gradient" ? (
              <Rect
                name="bg-layer-rect"
                x={0}
                y={0}
                width={dims.width}
                height={dims.height}
                fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                fillLinearGradientEndPoint={{ x: dims.width, y: dims.height }}
                fillLinearGradientColorStops={[
                  0,
                  background.color,
                  1,
                  background.secondaryColor,
                ]}
              />
            ) : (
              <Rect
                name="bg-layer-rect"
                x={0}
                y={0}
                width={dims.width}
                height={dims.height}
                fill={background.color}
              />
            )}

            {/* 和柄パターン */}
            {patternImage && (
              <Rect
                name="bg-layer-rect"
                x={0}
                y={0}
                width={dims.width}
                height={dims.height}
                fillPatternImage={patternImage}
                opacity={background.patternOpacity}
              />
            )}

            {/* 各デザイン要素 */}
            {elements.map((el) => {
              const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
                updateElement(el.id, {
                  x: Math.round(e.target.x()),
                  y: Math.round(e.target.y()),
                });
              };

              const handleTransformEnd = (e: Konva.KonvaEventObject<Event>) => {
                const node = e.target;
                const scaleX = node.scaleX();
                const scaleY = node.scaleY();
                node.scaleX(1);
                node.scaleY(1);
                updateElement(el.id, {
                  x: Math.round(node.x()),
                  y: Math.round(node.y()),
                  width: Math.max(40, Math.round(el.width * scaleX)),
                  height: Math.max(40, Math.round(el.height * scaleY)),
                  rotation: Math.round(node.rotation()),
                });
              };

              if (el.type === "text") {
                return (
                  <TextNode
                    key={el.id}
                    element={el}
                    year={year}
                    onSelect={() => selectElement(el.id)}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              }

              if (el.type === "image") {
                return (
                  <StyledImageNode
                    key={el.id}
                    element={el}
                    onSelect={() => selectElement(el.id)}
                    onDragEnd={handleDragEnd}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              }

              return (
                <StampNode
                  key={el.id}
                  element={el}
                  onSelect={() => selectElement(el.id)}
                  onDragEnd={handleDragEnd}
                  onTransformEnd={handleTransformEnd}
                />
              );
            })}

            <Transformer
              ref={transformerRef}
              rotateEnabled
              borderStroke="#B91C1C"
              anchorStroke="#B91C1C"
              anchorFill="#FFFFFF"
              anchorSize={14}
            />
          </Layer>

          {/* 印刷ガイド＆塗り足しガイド（エクスポート時は非表示にできるよう別レイヤー） */}
          {(showGuides || showBleed) && (
            <Layer name="guide-layer" listening={false}>
              {showBleed && (
                <Rect
                  x={dims.bleedPx}
                  y={dims.bleedPx}
                  width={dims.width - dims.bleedPx * 2}
                  height={dims.height - dims.bleedPx * 2}
                  stroke="#E11D48"
                  strokeWidth={2}
                  dash={[12, 8]}
                  opacity={0.7}
                />
              )}
              {showGuides && (
                <Rect
                  x={dims.safeMarginPx}
                  y={dims.safeMarginPx}
                  width={dims.width - dims.safeMarginPx * 2}
                  height={dims.height - dims.safeMarginPx * 2}
                  stroke="#0284C7"
                  strokeWidth={2}
                  dash={[8, 8]}
                  opacity={0.55}
                />
              )}
            </Layer>
          )}
        </Stage>
      </div>
    </div>
  );
}
