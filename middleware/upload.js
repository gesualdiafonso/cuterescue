import multer from "multer";

export const upload = multer({
  storage: multer.memoryStorage(), // armazena na RAM antes de enviar ao GridFS
  limits: { fileSize: 5 * 1024 * 1024 }, // limite de 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Tipo de arquivo inválido"));
    } else {
      cb(null, true);
    }
  },
});
