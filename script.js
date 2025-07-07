// Initialize jsPDF
const { jsPDF } = window.jspdf;

// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const imageList = document.getElementById('imageList');
const clearBtn = document.getElementById('clearBtn');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const emptyState = document.getElementById('emptyState');
const progressBar = document.getElementById('progressBar');
const progress = document.getElementById('progress');
const saveAdBtn = document.getElementById('saveAdBtn');
const uploadBtn = document.getElementById('uploadBtn');

// Settings elements
const borderWidth = document.getElementById('borderWidth');
const borderWidthValue = document.getElementById('borderWidthValue');
const borderColor = document.getElementById('borderColor');
const colorPreview = document.getElementById('colorPreview');
const borderStyle = document.getElementById('borderStyle');
const imageQuality = document.getElementById('imageQuality');
const imageQualityValue = document.getElementById('imageQualityValue');
const imageRotation = document.getElementById('imageRotation');
const imageRotationValue = document.getElementById('imageRotationValue');

// AdSense elements
const pubIdInput = document.getElementById('pubId');
const bannerIdInput = document.getElementById('bannerId');

// Store uploaded images
let uploadedImages = [];

// Initialize AdSense settings
function initAdSense() {
    const savedPubId = localStorage.getItem('adsense_pub_id');
    const savedBannerId = localStorage.getItem('adsense_banner_id');
    
    if (savedPubId) pubIdInput.value = savedPubId;
    if (savedBannerId) bannerIdInput.value = savedBannerId;
}

// Event Listeners
uploadBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', handleFileSelect);
clearBtn.addEventListener('click', clearAllImages);
generateBtn.addEventListener('click', generatePDF);
resetBtn.addEventListener('click', resetSettings);
saveAdBtn.addEventListener('click', saveAdSenseSettings);

// Settings event listeners
borderWidth.addEventListener('input', updateBorderWidth);
borderColor.addEventListener('input', updateColorPreview);
imageQuality.addEventListener('input', updateImageQuality);
imageRotation.addEventListener('input', updateImageRotation);

// Initialize settings
updateBorderWidth();
updateColorPreview();
updateImageQuality();
updateImageRotation();
initAdSense();

// Drag and drop functionality
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#4361ee';
    dropZone.style.backgroundColor = '#f0f5ff';
});

dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = '#dee2e6';
    dropZone.style.backgroundColor = '#fafbff';
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = '#dee2e6';
    dropZone.style.backgroundColor = '#fafbff';
    
    if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
    }
});

// Handle file selection
function handleFileSelect(e) {
    if (e.target.files.length) {
        handleFiles(e.target.files);
    }
}

function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check if file is an image
        if (!file.type.match('image.*')) continue;
        
        const reader = new FileReader();
        
        reader.onload = (function(file) {
            return function(e) {
                const imageData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    src: e.target.result,
                    rotation: 0
                };
                
                uploadedImages.push(imageData);
                renderImageList();
            };
        })(file);
        
        reader.readAsDataURL(file);
    }
    
    // Reset file input
    fileInput.value = '';
}

// Render image list
function renderImageList() {
    if (uploadedImages.length === 0) {
        imageList.innerHTML = '<div class="empty-state" id="emptyState"><div class="empty-icon">🖼️</div><p>No images uploaded yet</p></div>';
        return;
    }
    
    imageList.innerHTML = '';
    
    uploadedImages.forEach((image, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'image-item';
        imageItem.innerHTML = `
            <img src="${image.src}" alt="${image.name}" style="transform: rotate(${image.rotation}deg);">
            <div class="image-actions">
                <button title="Rotate" data-index="${index}" class="rotate-btn">↻</button>
                <button title="Move Up" data-index="${index}" class="up-btn">↑</button>
                <button title="Move Down" data-index="${index}" class="down-btn">↓</button>
                <button title="Remove" data-index="${index}" class="remove-btn">✕</button>
            </div>
        `;
        imageList.appendChild(imageItem);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            removeImage(index);
        });
    });
    
    document.querySelectorAll('.rotate-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            rotateImage(index);
        });
    });
    
    document.querySelectorAll('.up-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            moveImage(index, 'up');
        });
    });
    
    document.querySelectorAll('.down-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            moveImage(index, 'down');
        });
    });
}

// Remove image
function removeImage(index) {
    uploadedImages.splice(index, 1);
    renderImageList();
}

// Rotate image
function rotateImage(index) {
    uploadedImages[index].rotation = (uploadedImages[index].rotation + 90) % 360;
    renderImageList();
}

// Move image position
function moveImage(index, direction) {
    if (direction === 'up' && index > 0) {
        [uploadedImages[index - 1], uploadedImages[index]] = [uploadedImages[index], uploadedImages[index - 1]];
        renderImageList();
    } else if (direction === 'down' && index < uploadedImages.length - 1) {
        [uploadedImages[index], uploadedImages[index + 1]] = [uploadedImages[index + 1], uploadedImages[index]];
        renderImageList();
    }
}

// Clear all images
function clearAllImages() {
    uploadedImages = [];
    renderImageList();
}

// Update settings
function updateBorderWidth() {
    borderWidthValue.textContent = borderWidth.value + 'px';
}

function updateColorPreview() {
    colorPreview.style.backgroundColor = borderColor.value;
}

function updateImageQuality() {
    imageQualityValue.textContent = imageQuality.value + '%';
}

function updateImageRotation() {
    imageRotationValue.textContent = imageRotation.value + '°';
}

// Reset settings to default
function resetSettings() {
    borderWidth.value = 5;
    borderColor.value = '#4361ee';
    borderStyle.value = 'solid';
    imageQuality.value = 90;
    imageRotation.value = 0;
    
    updateBorderWidth();
    updateColorPreview();
    updateImageQuality();
    updateImageRotation();
}

// Save AdSense settings
function saveAdSenseSettings() {
    const pubId = pubIdInput.value.trim();
    const bannerId = bannerIdInput.value.trim();
    
    if (!pubId || !bannerId) {
        alert('Please enter both Publisher ID and Banner Ad Slot ID');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('adsense_pub_id', pubId);
    localStorage.setItem('adsense_banner_id', bannerId);
    
    // Update AdSense script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`;
    script.crossOrigin = "anonymous";
    
    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="adsbygoogle"]');
    if (existingScript) {
        document.head.removeChild(existingScript);
    }
    
    document.head.appendChild(script);
    
    // Update ad placeholders
    document.querySelectorAll('.ad-placeholder').forEach(ad => {
        ad.innerHTML = `
            <ins class="adsbygoogle"
                style="display:block"
                data-ad-client="${pubId}"
                data-ad-slot="${bannerId}"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
        `;
    });
    
    alert('AdSense settings saved successfully! Ads will appear on next page load.');
}

// Generate PDF
function generatePDF() {
    if (uploadedImages.length === 0) {
        alert('Please upload at least one image');
        return;
    }
    
    // Show progress bar
    progressBar.style.display = 'block';
    progress.style.width = '0%';
    
    // Show loading state
    const originalBtnText = generateBtn.innerHTML;
    generateBtn.innerHTML = '⏳ Processing...';
    generateBtn.disabled = true;
    
    // Create a new PDF instance
    const pageSize = document.getElementById('pageSize').value;
    const orientation = document.getElementById('pageOrientation').value;
    const pdf = new jsPDF(orientation, 'mm', pageSize);
    
    // Get settings
    const borderWidthVal = parseInt(borderWidth.value);
    const borderColorVal = borderColor.value;
    const borderStyleVal = borderStyle.value;
    const layout = document.getElementById('imageLayout').value;
    const quality = parseInt(imageQuality.value) / 100;
    
    // Process images and add to PDF
    let processedCount = 0;
    
    function processNextImage() {
        if (processedCount >= uploadedImages.length) {
            // Save the PDF when all images are processed
            pdf.save('converted-images.pdf');
            
            // Reset button state
            generateBtn.innerHTML = originalBtnText;
            generateBtn.disabled = false;
            progressBar.style.display = 'none';
            return;
        }
        
        const imageData = uploadedImages[processedCount];
        const img = new Image();
        img.src = imageData.src;
        
        img.onload = function() {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate dimensions based on layout
            let imgWidth, imgHeight;
            let padding = borderWidthVal;
            let x, y;
            
            switch(layout) {
                case 'full':
                    imgWidth = pageWidth - padding * 2;
                    imgHeight = img.naturalHeight * (imgWidth / img.naturalWidth);
                    
                    // If image is too tall for the page
                    if (imgHeight > pageHeight - padding * 2) {
                        imgHeight = pageHeight - padding * 2;
                        imgWidth = img.naturalWidth * (imgHeight / img.naturalHeight);
                    }
                    
                    x = (pageWidth - imgWidth) / 2;
                    y = (pageHeight - imgHeight) / 2;
                    break;
                    
                case 'single':
                    if (processedCount > 0) pdf.addPage();
                    
                    imgWidth = pageWidth - padding * 2;
                    imgHeight = img.naturalHeight * (imgWidth / img.naturalWidth);
                    
                    // If image is too tall for the page
                    if (imgHeight > pageHeight - padding * 2) {
                        imgHeight = pageHeight - padding * 2;
                        imgWidth = img.naturalWidth * (imgHeight / img.naturalHeight);
                    }
                    
                    x = (pageWidth - imgWidth) / 2;
                    y = (pageHeight - imgHeight) / 2;
                    break;
                    
                case 'double':
                    if (processedCount % 2 === 0 && processedCount > 0) {
                        pdf.addPage();
                    }
                    
                    imgWidth = (pageWidth - padding * 3) / 2;
                    imgHeight = img.naturalHeight * (imgWidth / img.naturalWidth);
                    
                    // Position based on index
                    if (processedCount % 2 === 0) {
                        x = padding;
                    } else {
                        x = pageWidth - imgWidth - padding;
                    }
                    
                    y = padding + Math.floor(processedCount / 2) * (imgHeight + padding);
                    
                    // If we run out of space on the page
                    if (y + imgHeight > pageHeight - padding) {
                        pdf.addPage();
                        y = padding;
                        
                        if (processedCount % 2 === 0) {
                            x = padding;
                        } else {
                            x = pageWidth - imgWidth - padding;
                        }
                    }
                    break;
                    
                case 'quad':
                    if (processedCount % 4 === 0 && processedCount > 0) {
                        pdf.addPage();
                    }
                    
                    imgWidth = (pageWidth - padding * 3) / 2;
                    imgHeight = (pageHeight - padding * 3) / 2;
                    
                    // Position based on index
                    const col = processedCount % 2;
                    const row = Math.floor(processedCount / 2) % 2;
                    
                    x = padding + col * (imgWidth + padding);
                    y = padding + row * (imgHeight + padding);
                    break;
            }
            
            // Add border
            if (borderWidthVal > 0) {
                pdf.setFillColor(borderColorVal);
                pdf.rect(
                    x - borderWidthVal, 
                    y - borderWidthVal, 
                    imgWidth + borderWidthVal * 2, 
                    imgHeight + borderWidthVal * 2, 
                    'F'
                );
            }
            
            // Add image to PDF
            pdf.addImage(
                img, 
                'JPEG', 
                x, 
                y, 
                imgWidth, 
                imgHeight,
                null,
                'FAST',
                imageData.rotation
            );
            
            // Update progress
            processedCount++;
            const progressPercent = Math.round((processedCount / uploadedImages.length) * 100);
            progress.style.width = progressPercent + '%';
            
            // Process next image after a small delay to prevent UI blocking
            setTimeout(processNextImage, 100);
        };
    }
    
    // Start processing
    processNextImage();
}
