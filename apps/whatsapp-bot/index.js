// index.js
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const Tesseract = require("tesseract.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Tokens
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN; // replace with your permanent WhatsApp token
const HF_API_TOKEN = process.env.HF_API_TOKEN; // from .env file

app.use(bodyParser.json());

// ✅ Webhook verification (Meta requirement)
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "civica123";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified ✅");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// ✅ Handle incoming WhatsApp messages
app.post("/webhook", async (req, res) => {
  console.log("📩 Incoming webhook:", JSON.stringify(req.body, null, 2));

  try {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0].value.messages
    ) {
      const message = req.body.entry[0].changes[0].value.messages[0];
      const from = message.from;
      const phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;

      let replyText = "⚠️ Unsupported message type.";

      // If text message
      if (message.type === "text") {
        replyText = `Hello 👋, you said: ${message.text.body}`;
      }

      // If document (PDF/DOCX)
      if (message.type === "document") {
        const mediaId = message.document.id;
        const fileName = message.document.filename;
        const mimeType = message.document.mime_type;

        console.log(`📄 Document received: ${fileName} (${mimeType})`);

        const filePath = await downloadMedia(mediaId, fileName);
        const extractedText = await extractText(filePath, mimeType);
        replyText = await summarizeText(extractedText);
      }

      // If image (OCR)
      if (message.type === "image") {
        const mediaId = message.image.id;
        console.log("🖼️ Image received");

        const filePath = await downloadMedia(mediaId, "image.jpg");
        const extractedText = await extractText(filePath, "image/jpeg");
        replyText = await summarizeText(extractedText);
      }

      // Send reply
      await axios.post(
        `https://graph.facebook.com/v17.0/${phone_number_id}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: replyText },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Reply sent!");
    }
  } catch (err) {
    console.error(
      "❌ Error handling message:",
      err.response ? err.response.data : err.message
    );
  }

  res.sendStatus(200);
});

// ✅ Function: Download media from WhatsApp
async function downloadMedia(mediaId, fileName) {
  const mediaUrlRes = await axios.get(
    `https://graph.facebook.com/v17.0/${mediaId}`,
    {
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
    }
  );
  const mediaUrl = mediaUrlRes.data.url;

  const fileRes = await axios.get(mediaUrl, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}` },
  });

  const filePath = `./tmp_${fileName}`;
  fs.writeFileSync(filePath, fileRes.data);
  return filePath;
}

// ✅ Function: Extract text from PDF, DOCX, or Image
async function extractText(filePath, mimeType) {
  let text = "";

  if (mimeType.includes("pdf")) {
    const data = await pdfParse(fs.readFileSync(filePath));
    text = data.text;
  } else if (
    mimeType.includes("word") ||
    mimeType.includes("docx") ||
    filePath.endsWith(".docx")
  ) {
    const data = await mammoth.extractRawText({ path: filePath });
    text = data.value;
  } else if (mimeType.includes("image")) {
    const result = await Tesseract.recognize(filePath, "eng");
    text = result.data.text;
  } else {
    text = "⚠️ Unsupported file type.";
  }

  return text.slice(0, 4000); // limit to 4000 chars
}

// ✅ Function: Summarize text using Hugging Face
async function summarizeText(text) {
  if (!text || text.trim().length === 0) {
    return "⚠️ No text could be extracted from the file.";
  }

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        timeout: 60000, // 60s timeout
      }
    );

    if (response.data && response.data[0] && response.data[0].summary_text) {
      return "📑 Summary:\n" + response.data[0].summary_text;
    } else {
      return "⚠️ Could not summarize the text.";
    }
  } catch (err) {
    console.error("❌ Hugging Face API error:", err.message);
    return "⚠️ Error while summarizing the text.";
  }
}

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
