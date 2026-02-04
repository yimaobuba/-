import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // 检查环境变量是否成功读入（这是为了排查你遇到的那个报错）
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error("环境变量缺失！检查 Vercel 设置。");
      return NextResponse.json({ error: '服务器配置错误：缺少数据库密钥' }, { status: 500 });
    }

    const userData = await request.json();
    const uniqueId = Math.random().toString(36).substring(2, 8);

    // 尝试写入数据
    await kv.set(`user:${uniqueId}`, userData);

    return NextResponse.json({ uniqueId });
  } catch (error: any) {
    console.error('API 报错详情:', error.message);
    return NextResponse.json({ error: `保存失败: ${error.message}` }, { status: 500 });
  }
}