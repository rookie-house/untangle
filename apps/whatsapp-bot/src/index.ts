import { Hono } from 'hono'
import type { Env } from './bindings'
import { uploadDocument } from './lib/api';

// Cloudflare Worker Entry
const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => c.text('Civica is running!'))

// ✅ Webhook verification (Meta requirement)
app.get('/webhook', (c) => {
  const VERIFY_TOKEN = 'civica123'
  const mode = c.req.query('hub.mode')
  const token = c.req.query('hub.verify_token')
  const challenge = c.req.query('hub.challenge')

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return c.text(challenge ?? '', 200)
    } else {
      return c.text('Forbidden', 403)
    }
  }
  return c.text('Bad Request', 400)
})

// ✅ Handle incoming WhatsApp messages
app.post('/webhook', async (c) => {
  const body = await c.req.json<any>()
  console.log('📩 Incoming webhook:', JSON.stringify(body, null, 2))

  try {
    if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
      const message = body.entry[0].changes[0].value.messages[0]
      const from = message.from
      const phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id 

      let replyText = '⚠️ Unsupported message type.'

      // If text message
      if (message.type === 'text') {
        replyText = `Hello Lawly, wellcome to Civica : ${message.text.body}`
      }

      // If document (PDF/DOCX) or Image → ⚠️ NOTE: Workers don’t support fs/ocr
    if (message.type === 'document' || message.type === 'image') {
      try {
        const mediaId = message.image?.id || message.document?.id;
        // Step 1: Get media URL from WhatsApp API
        const mediaUrlResp = await fetch(`https://graph.facebook.com/v20.0/${mediaId}`, {
          headers: {
            Authorization: `Bearer ${c.env.WHATSAPP_TOKEN}`,
          },
        });
        const mediaMeta = await mediaUrlResp.json() as { url: string };
        if (!mediaMeta.url) throw new Error('No media URL found');
        // Step 2: Download the actual file
        const mediaResp = await fetch(mediaMeta.url, {
          headers: {
            Authorization: `Bearer ${c.env.WHATSAPP_TOKEN}`,
          },
        });
        const arrayBuffer = await mediaResp.arrayBuffer();
        const fileName = message.image?.filename || message.document?.filename || (message.type === 'image' ? 'image.jpg' : 'document.pdf');
        const fileType = message.image?.mime_type || message.document?.mime_type || (message.type === 'image' ? 'image/jpeg' : 'application/pdf');
        // Create File object (browser/worker compatible)
        const file = new File([arrayBuffer], fileName, { type: fileType });
        // Call uploadDocument from lib/api (replace c.env.API_TOKEN with your actual API token variable)
        const apiToken = c.env.HF_API_TOKEN || '';
        const result = await uploadDocument(file, apiToken);
        replyText = `✅ File uploaded! Result: ${JSON.stringify(result)}`;
      } catch (err: any) {
        replyText = `❌ File upload failed: ${err instanceof Error ? err.message : String(err)}`;
      }
    }
      
   // Send reply back to WhatsApp
  await fetch(`https://graph.facebook.com/v17.0/${phone_number_id}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${c.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: from,
          text: { body: replyText },
        }),
      })

      console.log('✅ Reply sent!')
    }
  } catch (err: any) {
    console.error('❌ Error handling message:', err?.message)
  }

  return c.text('OK', 200)
})

// ✅ File upload proxy (updated to new API)
app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file'] as File

  // Forward file to new Untangled API endpoint
  const res = await fetch('https://untangled-api.rooki.house/api/documents/upload', {
    method: 'PUT',
    body: file,
  })

  return c.json(await res.json())
})

// ✅ Chat endpoint proxy (updated to new API)
app.post('/chat', async (c) => {
  const { message, sessionId, img } = await c.req.json<{
    message: string
    sessionId: string
    img?: any[]
  }>()

  // Forward chat to new Untangled API endpoint
  const res = await fetch('https://untangled-api.rooki.house/api/adk/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId, img }),
  })

  return c.json(await res.json())
})

// ✅ Summarize endpoint (proxy to Hugging Face)
app.post('/summarize', async (c) => {
  const { text } = await c.req.json<{ text: string }>()
  const summary = await summarizeText(text, c.env)
  return c.json({ summary })
})

// ✅ Summarize text via Hugging Face
async function summarizeText(text: string, env: Env) {
  if (!text?.trim()) return '⚠️ No text provided.'

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/sshleifer/distilbart-cnn-12-6',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text.slice(0, 1200) }),
      }
    )

    const data = await response.json()
    if (Array.isArray(data) && data[0]?.summary_text) {
      return '📑 Summary:\n' + data[0].summary_text
    }
    return '⚠️ Could not summarize the text.'
  } catch (err: any) {
    console.error('❌ Hugging Face API error:', err?.message)
    return '⚠️ Error while summarizing the text.'
  }
}

export default app;


