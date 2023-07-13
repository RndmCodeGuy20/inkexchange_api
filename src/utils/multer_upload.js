import multer from 'multer';

const storageEngine = multer.diskStorage({
  destination: './public/images',
  filename: (req, file, fn) => {
    fn(null, `${Date.now()}--${file.originalname}`);
  },
});

const upload = multer({
  storage: storageEngine,
});

export { upload };
