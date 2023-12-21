import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import multer from 'multer';
import cors from 'cors';
45;

const ___filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(___filename);
const app = express();
app.use(express.urlencoded({ extended: true }));
// Configuración de la ruta estática
app.use('/marcasDeAgua', express.static(path.join(__dirname, 'marcasDeAgua')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors());

// Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.send('home');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    let waterMark = 'WaterMark2.png';
    const selectWaterMark = req.body.watermark;
    if (selectWaterMark === '1') {
      waterMark = 'waterMark.png';
    } else if (selectWaterMark === '2') {
      waterMark = 'WaterMark2.png';
    } else if (selectWaterMark === '3') {
      waterMark = 'waterMark3.png';
    } else if (selectWaterMark === '4') {
      waterMark = 'waterMark4.png';
    } else if (selectWaterMark === '5') {
      waterMark = 'waterMark5.png';
    } else console.log(selectWaterMark);

    let image = req.file;

    // console.log(image);

    // Ruta de la marca de agua
    const marcaDeAguaPath = path.join(__dirname, 'marcasDeAgua', waterMark);

    // Redimensionar la marca de agua
    const marcaDeAguaBuffer = await sharp(marcaDeAguaPath)
      .resize(1080, 1080)
      .toBuffer();

    // Redimensionar la imagen principal al mismo tamaño que la marca de agua
    const imagenPrincipalBuffer = await sharp(image.buffer)
      .rotate()
      .resize(1080, 1080)
      .toBuffer();

    // Componer la imagen con la marca de agua
    const imagenConMarcaBuffer = await sharp(imagenPrincipalBuffer)
      .composite([{ input: marcaDeAguaBuffer }])
      .toBuffer();

    // Convierte la imagen con la marca de agua a base64
    const imagenConMarcaBufferBase64 = imagenConMarcaBuffer.toString('base64');

    //envia la imagen en formato base64 con la marca ya aplicada
    res.json({ imageData: imagenConMarcaBufferBase64 });
    console.log(
      `se ha aplicado los cambios a la imagen ${req.file.originalname}}`
    );
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    res.send({ error: 'Error al procesar la imagen.', error });
  }
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`app listening on port: ${PORT}`);
});
