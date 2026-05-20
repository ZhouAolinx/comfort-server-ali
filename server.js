require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // 使用 OpenAI 兼容客户端

const app = express();
app.use(cors());
app.use(express.json());

// 配置阿里云百炼的 OpenAI 兼容接口
const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

const MODEL = process.env.MODEL_NAME || 'qwen-plus';

// 安慰伙伴的系统提示词
const SYSTEM_PROMPT = {
  role: 'system',
  content: '你是温暖、共情的安慰伙伴。无论用户说什么，都用柔和、理解的口吻回应，像朋友一样倾听并给予安抚。回答尽量简短，不超过150字。',
};

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [SYSTEM_PROMPT, ...messages],
      temperature: 0.9,
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`后端运行在端口 ${PORT}`));