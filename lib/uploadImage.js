/*
 * Remote uploader to https://api.ferdev.my.id
 * Upload buffer ke server dan balikin direct link
 * @param {Buffer} buffer  File dalam bentuk Buffer
 * @returns {Promise<string>}  Direct link hasil upload
 */

import axios from "axios";
import FormData from "form-data";
import { fromBuffer } from "file-type";

export default async function uploadImage(buffer) {
  const { ext, mime } = (await fromBuffer(buffer)) || {};

  const form = new FormData();
  form.append("file", buffer, {
    filename: `tmp.${ext}`,
    contentType: mime,
  });

  try {
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

    console.log(data);
    return data.dlink;
  } catch (error) {
    console.error(
      "Upload error:",
      error.response?.data || error.message
    );
    throw error;
  }
}