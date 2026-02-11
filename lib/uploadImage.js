import axios from "axios";
import FormData from "form-data";
import fileType from "file-type";

const { fromBuffer } = fileType;

export default async function uploadImage(buffer) {
  const type = await fromBuffer(buffer);
  if (!type) throw new Error("Gagal mendeteksi tipe file");

  const { ext, mime } = type;

  const form = new FormData();
  form.append("file", buffer, {
    filename: `tmp.${ext}`,
    contentType: mime,
  });

  const headers = form.getHeaders();

  const length = await new Promise((resolve, reject) => {
    form.getLength((err, len) => {
      if (err) reject(err);
      else resolve(len);
    });
  });

  headers["Content-Length"] = length;

  const { data } = await axios.post(
    `${APIs.ferdev}/remote/uploader`,
    form,
    {
      headers,
      maxBodyLength: Infinity,
    }
  );

  return data.dlink;
}