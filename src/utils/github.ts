// src/utils/github.ts

export interface GitHubRelease {
  version: string;
  url: string;
  size: string; // Formatting to 'X.X MB'
  publishedAt: string;
  changelog: string;
}

export async function fetchLatestRelease(repo: string, lang: string = 'ru'): Promise<GitHubRelease | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'bit-tecnologies-website/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Failed to fetch from GitHub API for ${repo}: ${response.status} ${response.statusText}`);
      return null;
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      console.warn(`Invalid response from GitHub API for ${repo}`);
      return null;
    }

    // Find first APK asset if available
    const apkAsset = data.assets?.find((asset: any) =>
      asset && typeof asset === 'object' && asset.name && typeof asset.name === 'string' && asset.name.endsWith('.apk')
    );

    const sizeUnit = lang === 'en' ? 'MB' : 'МБ';
    const unknownLabel = lang === 'en' ? 'Unknown' : 'Неизвестно';
    const noDescLabel = lang === 'en' ? 'No release description.' : 'Нет описания релиза.';
    const locale = lang === 'en' ? 'en-US' : 'ru-RU';

    let sizeStr = unknownLabel;
    if (apkAsset && apkAsset.size && typeof apkAsset.size === 'number') {
      sizeStr = (apkAsset.size / (1024 * 1024)).toFixed(1) + ' ' + sizeUnit;
    }

    return {
      version: data.tag_name || data.name || 'Latest',
      url: data.html_url || `https://github.com/${repo}/releases/latest`,
      size: sizeStr,
      publishedAt: data.published_at ? new Date(data.published_at).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : unknownLabel,
      changelog: data.body || noDescLabel
    };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      console.error(`Timeout fetching GitHub release for ${repo}`);
    } else {
      console.error(`Error fetching GitHub release for ${repo}:`, e);
    }
    return null;
  }
}
