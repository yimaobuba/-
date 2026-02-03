import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

/** 生成随机 6 位字母数字 ID */
function generateUniqueId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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

/** 确保 ID 在现有数据中唯一 */
async function ensureUniqueId(existingIds: Set<string>): Promise<string> {
  let id: string;
  let attempts = 0;
  const maxAttempts = 100;
  do {
    id = generateUniqueId();
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error('无法生成唯一 ID');
    }
  } while (existingIds.has(id));
  return id;
}

export async function POST(request: Request) {
  let body: unknown;

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

  let existingData: Array<{ uniqueId: string; data: unknown }> = [];
  const dataDir = path.dirname(DB_PATH);

  try {
    await fs.mkdir(dataDir, { recursive: true });
    const content = await fs.readFile(DB_PATH, 'utf-8');
    const parsed = JSON.parse(content) as unknown;
    existingData = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr?.code !== 'ENOENT') {
      return NextResponse.json(
        { error: '读取存储失败' },
        { status: 500 }
      );
    }
  }

  const existingIds = new Set(existingData.map((entry) => entry.uniqueId));
  let uniqueId: string;

  try {
    uniqueId = await ensureUniqueId(existingIds);
  } catch {
    return NextResponse.json(
      { error: '生成唯一 ID 失败' },
      { status: 500 }
    );
  }

  const record = { uniqueId, data: body };
  existingData.push(record);

  try {
    await fs.writeFile(
      DB_PATH,
      JSON.stringify(existingData, null, 2),
      'utf-8'
    );
  } catch {
    return NextResponse.json(
      { error: '写入存储失败' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { uniqueId },
    { status: 200 }
  );
}
