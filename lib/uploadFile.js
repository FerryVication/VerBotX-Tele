/*
 * Remote uploader to https://api.ferdev.my.id
 * Upload buffer ke server dan balikin direct link
 * @param {Buffer} buffer  File dalam bentuk Buffer
 * @returns {Promise<string>}  Direct link hasil upload
 */
 
import fetch from "node-fetch";
import FormData from "form-data";
import fileType from "file-type";

export default async function uploadFile(buffer, tmp = false) {
  // console.log('--- uploadFile() called ---');
  if (!Buffer.isBuffer(buffer)) throw new Error("Input must be a Buffer");

  const type = await fileType.fromBuffer(buffer);
  // console.log('File Type:', type);
  if (!type) throw new Error("Unsupported file type");

  const form = new FormData();
  form.append("file", buffer, {
    filename: `file.${type.ext}`,
    contentType: type.mime,
  });
  form.append("tmp", String(tmp));

  const url = `${APIs.ferdev}/remote/uploader`;
  // console.log('Sending request to:', url);

  const res = await fetch(url, {
    method: "POST",
    headers: form.getHeaders(),
    body: form,
  });

  const rawText = await res.text();
  // console.log('Raw Response Text:', rawText || '(empty)');
  let json;
  try {
    json = JSON.parse(rawText);
  } catch {
    throw new Error(`Invalid JSON response from CDN`);
  }

  // console.log('UploadFile JSON Response:', json);

  if (!json.success) throw new Error(json.message || "Upload failed");

  const outUrl = json.dlink;
  if (!outUrl) throw new Error("CDN response missing URL");

  return outUrl;
}
