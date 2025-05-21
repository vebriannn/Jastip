if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/nemolab/member/js/service-worker.js')
            .catch((error) => console.error('ServiceWorker registration failed:', error));
    });
}

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js';

const ebookElement = document.getElementById('ebook');
const url = ebookElement.getAttribute('data-pdf');
const canvas = document.getElementById('pdf-render');
const ctx = canvas.getContext('2d');
console.log(url);

let pdfDoc = null;
let pageNum = 1;
let scale = window.innerWidth < 768 ? 0.8 : 1.6;
const minScale = 0.8;
const maxScale = 2.5;
let totalPages = 0;
let isRendering = false;

const renderPage = (num) => {
    if (isRendering) return;
    isRendering = true;

    // Tampilkan loading
    document.getElementById('pdf-loading').style.display = 'block';
    canvas.style.display = 'none';

    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale });
        // Mengatur resolusi kanvas berdasarkan devicePixelRatio
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;
        const renderContext = {
            canvasContext: ctx,
            viewport: viewport,
            transform: transform,
        };

        return new Promise((resolve) => {
            requestAnimationFrame(() => {
                page.render(renderContext).promise.then(() => {
                    resolve();
                });
            });
        });
    }).then(() => {
        document.getElementById('page-input').value = num;
        document.getElementById('page-count').textContent = totalPages;
    }).catch(error => {
        console.error('Error rendering page:', error);
        alert('Failed to load the page.');
    }).finally(() => {
        isRendering = false;
        // Sembunyikan loading dan tampilkan canvas setelah render selesai
        document.getElementById('pdf-loading').style.display = 'none';
        canvas.style.display = 'block';
    });
};

// Mengambil dokumen PDF
pdfjsLib.getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
    totalPages = pdf.numPages;
    renderPage(pageNum);
}).catch(error => {
    console.error('Error loading PDF:', error);
    alert('Failed to load PDF.');
});


// Fungsi untuk memperbarui zoom
const updateZoom = (factor) => {
    if (factor === 0) {
      
        scale = window.innerWidth < 768 ? 0.8 : 1.6;
    } else {
        
        scale = Math.max(minScale, Math.min(maxScale, scale + factor));
    }
    renderPage(pageNum);
};
// Event listeners untuk navigasi dan zoom
document.getElementById('prev-page').addEventListener('click', () => {
    if (pageNum > 1) {
        pageNum--;
        renderPage(pageNum);
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    if (pageNum < totalPages) {
        pageNum++;
        renderPage(pageNum);
    }
});

document.getElementById('zoom-in').addEventListener('click', () => updateZoom(0.1));
document.getElementById('zoom-out').addEventListener('click', () => updateZoom(-0.1));
document.getElementById('reset-zoom').addEventListener('click', () => updateZoom(0));

// Event untuk input nomor halaman
document.getElementById('page-input').addEventListener('change', (e) => {
    const pageNumber = parseInt(e.target.value);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        pageNum = pageNumber;
        renderPage(pageNum);
    }
});

// Fungsi untuk fullscreen mode
document.getElementById('pdf-fullscreen').addEventListener('click', () => {
    const elem = document.getElementById('ebook');
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => console.error(`Fullscreen mode error: ${err.message}`));
    } else {
        document.exitFullscreen();
    }
});

// Pinch-to-zoom untuk perangkat mobile
let initialDistance = null;

const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
        initialDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
    }
};

const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistance) {
        const newDistance = Math.hypot(
            e.touches[0].pageX - e.touches[1].pageX,
            e.touches[0].pageY - e.touches[1].pageY
        );
        const zoomFactor = newDistance > initialDistance ? 0.05 : -0.05;
        updateZoom(zoomFactor);
        initialDistance = newDistance;
    }
};

const handleTouchEnd = () => {
    initialDistance = null;
};

// Menambahkan event listeners untuk pinch-to-zoom pada canvas
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);