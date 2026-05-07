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

    const response = await fetch(`https://api.github.com/repos/${repo}/releases`, {
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
    if (!data || !Array.isArray(data)) {
      console.warn(`Invalid response from GitHub API for ${repo}`);
      return null;
    }

    // Find the latest release with a matching APK asset
    let latestRelease = null;
    let apkAsset = null;

    for (const release of data) {
      const foundAsset = release.assets?.find((asset: any) =>
        asset && typeof asset === 'object' && asset.name && typeof asset.name === 'string' &&
        asset.name.match(/^bithub-\d+-v\d+\.\d+\.\d+\.\d+-release\.apk$/)
      );

      if (foundAsset) {
        apkAsset = foundAsset;
        latestRelease = release;
        break; // Use the first (most recent) release with a matching APK
      }
    }

    if (!latestRelease) {
      console.warn(`No release found with matching APK pattern for ${repo}`);
      return null;
    }

    const sizeUnit = lang === 'en' ? 'MB' : 'МБ';
    const unknownLabel = lang === 'en' ? 'Unknown' : 'Неизвестно';
    const noDescLabel = lang === 'en' ? 'No release description.' : 'Нет описания релиза.';
    const locale = lang === 'en' ? 'en-US' : 'ru-RU';

    let sizeStr = unknownLabel;
    if (apkAsset && apkAsset.size && typeof apkAsset.size === 'number') {
      sizeStr = (apkAsset.size / (1024 * 1024)).toFixed(1) + ' ' + sizeUnit;
    }

    return {
      version: latestRelease.tag_name || latestRelease.name || 'Latest',
      url: apkAsset?.browser_download_url || latestRelease.html_url || `https://github.com/${repo}/releases/latest`,
      size: sizeStr,
      publishedAt: latestRelease.published_at ? new Date(latestRelease.published_at).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : unknownLabel,
      changelog: latestRelease.body || noDescLabel
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
