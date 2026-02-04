import { createClient } from '@vercel/kv';
import { NextResponse } from 'next/server';

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const uniqueId = Math.random().toString(36).substring(2, 8);

    // 尝试写入
    await kv.set(`user:${uniqueId}`, userData);

    return NextResponse.json({ uniqueId });
  } catch (error: any) {
    // 💡 重点：如果失败，弹窗会显示 V3-Final，这样我们就知道代码更新了
    return NextResponse.json({ 
      error: 'V3-Final-数据库连接失败', 
      details: error.message 
    }, { status: 500 });
  }
}