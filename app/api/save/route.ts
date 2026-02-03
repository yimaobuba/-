import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// 使用环境变量初始化 Upstash Redis 客户端
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/** 生成随机 6 位字母数字 ID */
function generateUniqueId(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  const randomValues = new Uint8Array(6);

  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < 6; i++) {
      id += chars[randomValues[i]! % chars.length];
    }
  } else {
    for (let i = 0; i < 6; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  return id;
}

export async function POST(request: Request) {
  let body: unknown;

  // 解析并校验请求体
  try {
    const text = await request.text();
    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: '请求体为空' },
        { status: 400 }
      );
    }
    body = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json(
      { error: '无效的 JSON 格式' },
      { status: 400 }
    );
  }

  const uniqueId = generateUniqueId();

  try {
    // 使用 Upstash Redis 存储用户数据
    await redis.set(uniqueId, body);

    return NextResponse.json(
      { uniqueId },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : '未知错误';

    return NextResponse.json(
      {
        error: '保存数据失败',
        message,
      },
      { status: 500 }
    );
  }
}
