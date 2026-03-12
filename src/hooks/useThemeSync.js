import { useEffect } from "react";

const useThemeSync = (imageUrl) => {
    useEffect(() => {
        if (!imageUrl) return;

        const defaultPink = "#da2f68";
        const defaultOrange = "#f89e00";

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0;

            // Sample every 10 pixels to save performance
            for (let i = 0; i < imageData.length; i += 40) {
                r += imageData[i];
                g += imageData[i + 1];
                b += imageData[i + 2];
            }

            const pixelCount = imageData.length / 40;
            r = Math.floor(r / pixelCount);
            g = Math.floor(g / pixelCount);
            b = Math.floor(b / pixelCount);

            const dominantColor = `rgb(${r}, ${g}, ${b})`;
            
            // Create a lighter/vibrant secondary color
            const r2 = Math.min(255, r + 40);
            const g2 = Math.min(255, g + 60);
            const b2 = Math.min(255, b + 80);
            const accentColor = `rgb(${r2}, ${g2}, ${b2})`;

            document.documentElement.style.setProperty("--pink", accentColor);
            document.documentElement.style.setProperty("--orange", dominantColor);
            document.documentElement.style.setProperty("--gradient", `linear-gradient(98.37deg, ${dominantColor} 0.99%, ${accentColor} 100%)`);
        };

        return () => {
            document.documentElement.style.setProperty("--pink", defaultPink);
            document.documentElement.style.setProperty("--orange", defaultOrange);
            document.documentElement.style.setProperty("--gradient", `linear-gradient(98.37deg, ${defaultOrange} 0.99%, ${defaultPink} 100%)`);
        };
    }, [imageUrl]);
};

export default useThemeSync;
