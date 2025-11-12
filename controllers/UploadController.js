import { GridFSBucket } from "mongodb";
import clientPromise from "../services/useConnection.js";
import { Readable } from "stream";

class UploadController {
  async uploadFile(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: "Nenhum arquivo foi enviado" });

      const client = await clientPromise;
      const db = client.db("cuterescue");
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });

      const filename = `${Date.now()}-cuterescue-${req.file.originalname}`;
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: req.file.mimetype,
      });

      const readableStream = new Readable();
      readableStream.push(req.file.buffer);
      readableStream.push(null); // fim do stream

      readableStream.pipe(uploadStream)
        .on("error", (err) => {
          console.error("❌ Erro ao salvar no GridFS:", err);
          res.status(500).json({ error: "Erro ao enviar o arquivo" });
        })
        .on("finish", () => {
          res.status(201).json({
            message: "Arquivo enviado com sucesso",
            filename,
            id: uploadStream.id,
            fileUrl: `/api/upload/${filename}`,
          });
        });

    } catch (error) {
      console.error("❌ Erro geral no upload:", error);
      res.status(500).json({ error: "Erro interno ao enviar o arquivo" });
    }
  }

  async getFile(req, res) {
    try {
      const { filename } = req.params;
      const client = await clientPromise;
      const db = client.db("cuterescue");
      const bucket = new GridFSBucket(db, { bucketName: "uploads" });

      const stream = bucket.openDownloadStreamByName(filename);

      stream.on("error", (err) => {
        console.error("❌ Erro stream:", err);
        return res.status(404).json({ error: "Arquivo não encontrado" });
      });

      res.set("Content-Type", "image/jpeg");
      stream.pipe(res);
    } catch (error) {
      console.error("❌ Erro ao recuperar arquivo:", error);
      res.status(500).json({ error: "Erro interno ao recuperar arquivo" });
    }
  }
}

export default new UploadController();
