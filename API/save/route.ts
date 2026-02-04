import { createClient } from '@vercel/kv';
import { NextResponse } from 'next/server';

// 手动初始化客户端，确保变量名绝对匹配
const kv = createClient({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

function generateShortId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // 调试：如果变量缺失，在日志里打印出来（别担心，线上日志只有你能看）
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        return NextResponse.json({ error: '环境变量配置缺失' }, { status: 500 });
    }

    const uniqueId = generateShortId();
    
    // 存储数据
    await kv.set(`user:${uniqueId}`, userData);

    return NextResponse.json({ uniqueId });
    
  } catch (error: any) {
    console.error('保存失败详情:', error);
    return NextResponse.json({ error: error.message || '保存失败' }, { status: 500 });
  }
}