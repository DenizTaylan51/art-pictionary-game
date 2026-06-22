import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { t } from '../utils/translations';
import './Canvas.css';

export default function Canvas({ isViewer = false }) {
  const canvasRef = useRef(null);
  const {
    setCanvas,
    brush,
    setBrush,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clearCanvas,
    language
  } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setCanvas(canvas);
    }
  }, [setCanvas]);

  const handleMouseDown = (e) => {
    if (isViewer) return;
    const rect = canvasRef.current.getBoundingClientRect();
    startDrawing(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseMove = (e) => {
    if (isViewer) return;
    const rect = canvasRef.current.getBoundingClientRect();
    draw(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleMouseUp = () => {
    if (isViewer) return;
    stopDrawing();
  };

  const handleTouchStart = (e) => {
    if (isViewer) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    startDrawing(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchMove = (e) => {
    if (isViewer) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    draw(touch.clientX - rect.left, touch.clientY - rect.top);
  };

  const handleTouchEnd = () => {
    if (isViewer) return;
    stopDrawing();
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {!isViewer && (
        <div className="canvas-toolbar">
          <div className="toolbar-group">
            <label>{t('brushSize', language)}:</label>
            <input
              type="range"
              min="1"
              max="30"
              value={brush.size}
              onChange={(e) => setBrush({ size: parseInt(e.target.value) })}
              className="size-slider"
            />
            <span className="size-value">{brush.size}px</span>
          </div>

          <div className="toolbar-group">
            <label>{t('color', language)}:</label>
            <input
              type="color"
              value={brush.color}
              onChange={(e) => setBrush({ color: e.target.value, tool: 'pen' })}
              className="color-picker"
            />
          </div>

          <div className="toolbar-buttons">
            <button
              className={`btn-tool ${brush.tool === 'pen' ? 'active' : ''}`}
              onClick={() => setBrush({ tool: 'pen' })}
              title={t('draw', language)}
            >
              ✏️
            </button>
            <button
              className={`btn-tool ${brush.tool === 'eraser' ? 'active' : ''}`}
              onClick={() => setBrush({ tool: 'eraser' })}
              title={t('eraser', language)}
            >
              🧹
            </button>
            <button className="btn-tool" onClick={undo} title={t('undo', language)}>
              ↶
            </button>
            <button className="btn-tool" onClick={redo} title={t('redo', language)}>
              ↷
            </button>
            <button className="btn-tool btn-danger" onClick={clearCanvas} title={t('clear', language)}>
              🗑️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
