import QRCode from 'qrcode';
import type { QRStyle, ContentType } from '../types/qr';

export const qrRenderer = {
  render: (
    canvas: HTMLCanvasElement,
    text: string,
    style: QRStyle,
    detectedType: ContentType
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!text.trim()) {
        resolve();
        return;
      }

      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context'));
          return;
        }

        // Generate QR code raw bit-matrix with High Error Correction (30% recovery)
        const qr = QRCode.create(text, { errorCorrectionLevel: 'H' });
        const modules = qr.modules;
        const size = modules.size;

        // Configure canvas sizing to high resolution for clear scans
        const canvasSize = 512;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Clear canvas and draw background
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(0, 0, canvasSize, canvasSize);

        const cellSize = canvasSize / size;

        // Helper: rounded rectangle path drawing
        const drawRoundedRect = (
          c2d: CanvasRenderingContext2D,
          x: number,
          y: number,
          w: number,
          h: number,
          r: number
        ) => {
          c2d.beginPath();
          c2d.moveTo(x + r, y);
          c2d.lineTo(x + w - r, y);
          c2d.quadraticCurveTo(x + w, y, x + w, y + r);
          c2d.lineTo(x + w, y + h - r);
          c2d.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          c2d.lineTo(x + r, y + h);
          c2d.quadraticCurveTo(x, y + h, x, y + h - r);
          c2d.lineTo(x, y + r);
          c2d.quadraticCurveTo(x, y, x + r, y);
          c2d.closePath();
        };

        // Helper: check if a coordinate falls inside any of the three 7x7 Finder Patterns
        const isFinderPattern = (r: number, c: number): boolean => {
          if (r < 7 && c < 7) return true; // Top-Left
          if (r < 7 && c >= size - 7) return true; // Top-Right
          if (r >= size - 7 && c < 7) return true; // Bottom-Left
          return false;
        };

        // Helper: check if coordinate falls inside the central logo region (5x5 matrix blocks)
        const centerIndex = Math.floor(size / 2);
        const isCenterLogoRegion = (r: number, c: number): boolean => {
          if (!style.useCenterLogo) return false;
          return r >= centerIndex - 2 && r <= centerIndex + 2 && c >= centerIndex - 2 && c <= centerIndex + 2;
        };

        // 1. Draw regular body modules (skip Finder Patterns and Center Logo area)
        ctx.fillStyle = style.foregroundColor;
        for (let r = 0; r < size; r++) {
          for (let c = 0; c < size; c++) {
            if (modules.get(r, c) === 1) {
              if (isFinderPattern(r, c) || isCenterLogoRegion(r, c)) {
                continue;
              }

              const x = c * cellSize;
              const y = r * cellSize;

              if (style.dotType === 'rounded') {
                ctx.beginPath();
                // Draw a circular dot with a slight safety margin (scale 0.88)
                const radius = (cellSize / 2) * 0.88;
                ctx.arc(x + cellSize / 2, y + cellSize / 2, radius, 0, 2 * Math.PI);
                ctx.fill();
              } else {
                ctx.fillRect(x, y, cellSize, cellSize);
              }
            }
          }
        }

        // 2. Draw unified Finder Patterns (corners)
        const drawFinder = (startX: number, startY: number) => {
          const outerSize = 7 * cellSize;
          
          if (style.cornerType === 'rounded') {
            const outerRadius = outerSize * 0.22;
            ctx.fillStyle = style.foregroundColor;
            drawRoundedRect(ctx, startX, startY, outerSize, outerSize, outerRadius);
            ctx.fill();

            // Draw inner background cutout (5x5 blocks)
            const innerBgSize = 5 * cellSize;
            const innerBgOffset = cellSize;
            const innerBgRadius = innerBgSize * 0.22;
            ctx.fillStyle = style.backgroundColor;
            drawRoundedRect(
              ctx,
              startX + innerBgOffset,
              startY + innerBgOffset,
              innerBgSize,
              innerBgSize,
              innerBgRadius
            );
            ctx.fill();

            // Draw solid inner center (3x3 blocks)
            const innerCenterSize = 3 * cellSize;
            const innerCenterOffset = 2 * cellSize;
            const innerCenterRadius = innerCenterSize * 0.22;
            ctx.fillStyle = style.foregroundColor;
            drawRoundedRect(
              ctx,
              startX + innerCenterOffset,
              startY + innerCenterOffset,
              innerCenterSize,
              innerCenterSize,
              innerCenterRadius
            );
            ctx.fill();
          } else {
            // Traditional square corners
            ctx.fillStyle = style.foregroundColor;
            ctx.fillRect(startX, startY, outerSize, outerSize);

            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(startX + cellSize, startY + cellSize, 5 * cellSize, 5 * cellSize);

            ctx.fillStyle = style.foregroundColor;
            ctx.fillRect(startX + 2 * cellSize, startY + 2 * cellSize, 3 * cellSize, 3 * cellSize);
          }
        };

        // Top-Left corner
        drawFinder(0, 0);
        // Top-Right corner
        drawFinder((size - 7) * cellSize, 0);
        // Bottom-Left corner
        drawFinder(0, (size - 7) * cellSize);

        // 3. Render Center Logo
        if (style.useCenterLogo) {
          const logoSize = 5 * cellSize;
          const logoX = (canvasSize - logoSize) / 2;
          const logoY = (canvasSize - logoSize) / 2;

          // Draw the background protective frame
          ctx.fillStyle = style.backgroundColor;
          drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, logoSize * 0.22);
          ctx.fill();

          // Prepare to draw active logo
          const innerSize = logoSize * 0.7;
          const innerX = logoX + logoSize * 0.15;
          const innerY = logoY + logoSize * 0.15;

          // If content is a URL, Email, Phone, or WiFi, draw a high-fidelity vector icon
          if (detectedType !== 'text') {
            ctx.strokeStyle = style.foregroundColor;
            ctx.lineWidth = innerSize * 0.08;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            if (detectedType === 'url') {
              // 🌐 Sleek Globe/Web Icon
              const radius = innerSize * 0.4;
              const cx = innerX + innerSize / 2;
              const cy = innerY + innerSize / 2;

              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(cx - radius, cy);
              ctx.lineTo(cx + radius, cy);
              ctx.stroke();

              ctx.beginPath();
              ctx.ellipse(cx, cy, radius * 0.4, radius, 0, 0, 2 * Math.PI);
              ctx.stroke();
            } else if (detectedType === 'email') {
              // ✉️ Clean Envelope Icon
              const padX = innerSize * 0.1;
              const padY = innerSize * 0.25;
              const iw = innerSize * 0.8;
              const ih = innerSize * 0.5;

              ctx.strokeRect(innerX + padX, innerY + padY, iw, ih);

              ctx.beginPath();
              ctx.moveTo(innerX + padX, innerY + padY);
              ctx.lineTo(innerX + innerSize / 2, innerY + padY + ih * 0.55);
              ctx.lineTo(innerX + innerSize - padX, innerY + padY);
              ctx.stroke();
            } else if (detectedType === 'phone') {
              // 📱 Modern Cell Phone Outline
              const cellW = innerSize * 0.48;
              const cellH = innerSize * 0.85;
              const cellX = innerX + (innerSize - cellW) / 2;
              const cellY = innerY + (innerSize - cellH) / 2;

              drawRoundedRect(ctx, cellX, cellY, cellW, cellH, innerSize * 0.08);
              ctx.stroke();

              // Top speaker
              ctx.beginPath();
              ctx.moveTo(cellX + cellW * 0.35, cellY + cellH * 0.12);
              ctx.lineTo(cellX + cellW * 0.65, cellY + cellH * 0.12);
              ctx.stroke();

              // Bottom home circle
              ctx.beginPath();
              ctx.arc(cellX + cellW / 2, cellY + cellH * 0.86, innerSize * 0.05, 0, 2 * Math.PI);
              ctx.stroke();
            } else if (detectedType === 'wifi') {
              // 📶 Dynamic WiFi Arc Icon
              const bcx = innerX + innerSize / 2;
              const bcy = innerY + innerSize * 0.8;

              // Center dot
              ctx.fillStyle = style.foregroundColor;
              ctx.beginPath();
              ctx.arc(bcx, bcy, innerSize * 0.07, 0, 2 * Math.PI);
              ctx.fill();

              // Concentric waves
              ctx.beginPath();
              ctx.arc(bcx, bcy, innerSize * 0.28, -Math.PI * 0.78, -Math.PI * 0.22);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(bcx, bcy, innerSize * 0.56, -Math.PI * 0.78, -Math.PI * 0.22);
              ctx.stroke();
            }

            resolve();
          } else {
            // 🏷️ Fallback: Draw default Brand Logo (loaded asynchronously)
            const logo = new Image();
            logo.src = '/icon-128.png';

            logo.onload = () => {
              const imgSize = logoSize * 0.76;
              const imgOffset = logoSize * 0.12;
              
              drawRoundedRect(
                ctx,
                logoX + imgOffset,
                logoY + imgOffset,
                imgSize,
                imgSize,
                imgSize * 0.22
              );

              ctx.save();
              ctx.clip();
              ctx.drawImage(logo, logoX + imgOffset, logoY + imgOffset, imgSize, imgSize);
              ctx.restore();

              resolve();
            };

            logo.onerror = (err) => {
              console.warn('Failed to load center logo image:', err);
              // Resolve anyway to complete rendering
              resolve();
            };
          }
        } else {
          resolve();
        }
      } catch (err) {
        reject(err);
      }
    });
  },
};
