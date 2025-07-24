export function getHostname(url: string | null) {
  if (!url) return '';

  try {
    const { hostname } = new URL(url);

    return hostname.replaceAll('www.', '');
  } catch {
    return '';
  }
}

export function isValidURL(url: string) {
  try {
    new URL(url);

    return true;
  } catch {
    return false;
  }
}

export async function getTitleFromURL(url: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  const result = await fetch(url, { signal: controller.signal })
    .then((res) => {
      clearTimeout(timeoutId);
      return res.text();
    })
    .then((body: string) => {
      const titleMatch = /<title>([^<]*)<\/title>/i.exec(body);
      const title =
        titleMatch && typeof titleMatch[1] === 'string'
          ? titleMatch[1]
          : 'No title found';

      return title;
    })
    .catch((err) => {
      console.log(err);
      return 'No title found';
    });

  return result;
}
