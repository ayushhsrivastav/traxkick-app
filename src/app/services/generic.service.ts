export async function isValidImageUrl(url: string): Promise<boolean> {
  try {
    const got = (await import('got')).default;
    // Validate URL format
    new URL(url);

    // Allowed image extensions
    const imageExtensions = [
      '.jpg',
      '.jpeg',
      '.png',
      '.gif',
      '.bmp',
      '.webp',
      '.svg',
    ];
    if (!imageExtensions.some(ext => url.toLowerCase().endsWith(ext))) {
      return false;
    }

    // Make a HEAD request
    const response = await got(url, {
      method: 'HEAD',
      timeout: 5000,
      followRedirect: true,
    });
    const contentType = response.headers['content-type'];

    return contentType?.startsWith('image/') ?? false;
  } catch {
    return false;
  }
}
