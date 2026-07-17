import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DEFAULT_SITE_CONFIG } from '@/lib/default-config';

const CONFIG_FILE_PATH = path.join(process.cwd(), 'lib', 'config.json');

// Helper to check authentication
function isAuthorized(req: NextRequest): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'password123';
  const expectedToken = Buffer.from(`${expectedUsername}:${expectedPassword}`).toString('base64');

  // Check Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === expectedToken) return true;
  }

  // Check Cookie header
  const cookieSession = req.cookies.get('admin_session')?.value;
  if (cookieSession === expectedToken) return true;

  return false;
}

export async function GET() {
  try {
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const fileData = await fs.promises.readFile(CONFIG_FILE_PATH, 'utf-8');
      const config = JSON.parse(fileData);
      return NextResponse.json({ success: true, config });
    }
  } catch (error) {
    console.error('Error reading config file, falling back to default:', error);
  }

  // Return the default hardcoded config if file doesn't exist or failed to load
  return NextResponse.json({ success: true, config: DEFAULT_SITE_CONFIG, isDefault: true });
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const newConfig = await req.json();

    // Basic structure verification to prevent complete corruption of settings
    if (!newConfig || !newConfig.offers || !newConfig.texts) {
      return NextResponse.json(
        { success: false, error: 'Invalid configuration payload' },
        { status: 400 }
      );
    }

    // Write to local file
    const dir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }

    await fs.promises.writeFile(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully'
    });
  } catch (error: any) {
    console.error('Error writing config:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}
