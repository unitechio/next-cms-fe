'use client';

import { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface ImageViewerProps {
    images: string[];
    initialIndex?: number;
    onClose: () => void;
}

export function ImageViewer({ images, initialIndex = 0, onClose }: ImageViewerProps) {
    const [index, setIndex] = useState(initialIndex);

    if (images.length === 0) return null;

    return (
        <Lightbox
            mainSrc={images[index]}
            nextSrc={images[(index + 1) % images.length]}
            prevSrc={images[(index + images.length - 1) % images.length]}
            onCloseRequest={onClose}
            onMovePrevRequest={() => setIndex((index + images.length - 1) % images.length)}
            onMoveNextRequest={() => setIndex((index + 1) % images.length)}
            imageTitle={`${index + 1} / ${images.length}`}
            toolbarButtons={[
                <button
                    key="download"
                    type="button"
                    className="ril-toolbar__item__child ril__toolbarItemChild ril__builtinButton"
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = images[index];
                        link.download = `image-${index + 1}`;
                        link.click();
                    }}
                >
                    Download
                </button>,
            ]}
        />
    );
}
