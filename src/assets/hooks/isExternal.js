export const isExternal = (url) => {
  if (typeof url !== 'string' || !url.startsWith('http')) return false;

  try {
    return new URL(url).hostname !== window.location.hostname;
  } catch (e) {
    return false;
  }
};

export default isExternal;
