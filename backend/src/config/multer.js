const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const sanitizedName = file.originalname
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9.]/g, '_')
            .replace(/\s+/g, '_');

        cb(null, `temp_${Date.now()}_${sanitizedName}`);
    }
});

const processImage = async (file) => {
    const finalFilename = file.filename.replace('temp_', 'compressed_');
    const outputPath = path.join(uploadsDir, finalFilename);

    try {
        let image = sharp(file.path);
        const metadata = await image.metadata();

        // Redimensionner si l'image est très grande (par exemple max 1280px de large)
        if (metadata.width > 1280) {
            image = image.resize(1280, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // On compresse selon le format
        switch (metadata.format) {
            case 'jpeg':
                image = image.jpeg({
                    quality: 50,
                    mozjpeg: true,
                    chromaSubsampling: '4:2:0'
                });
                break;
            case 'png':
                image = image.webp({   // Conversion en WebP
                    quality: 50
                });
                break;
            case 'webp':
                image = image.webp({
                    quality: 50
                });
                break;
            default:
                // Pour tous les autres formats, on peut tenter le WebP
                image = image.webp({
                    quality: 50
                });
                break;
        }

        await image.toFile(outputPath);

        // Supprimer le fichier temporaire
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        return finalFilename;
    } catch (error) {
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        throw error;
    }
};

module.exports = {
    upload: multer({
        storage,
        fileFilter: (req, file, cb) => {
            cb(null, file.mimetype.startsWith('image/'));
        },
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB
    }),
    processImage
};