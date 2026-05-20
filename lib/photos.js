const UNSPLASH_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;

export async function getDestinationPhoto(destination) {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination + ' travel landmark')}&per_page=5&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    const data = await res.json();
    const photos = data.results;
    if (!photos?.length) return null;
    return photos.map(p => p.urls.regular);
  } catch {
    return null;
  }
}