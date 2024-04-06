export function _getConvertedMediaType(_apiMedia: any) {
  if (_apiMedia.media_type && _apiMedia.media_type === "movie") return "FILM";
  if (_apiMedia.media_type && _apiMedia.media_type === "tv") {
    // Check for attributes of anime
    if (
      _apiMedia.origin_country &&
      _apiMedia.origin_country.includes("JP") &&
      _apiMedia.genre_ids.includes(16)
    ) {
      return "ANIME";
    } else return "TV";
  }

  if (!_apiMedia.media_type && _apiMedia.title) return "FILM";
  if (!_apiMedia.media_type && _apiMedia.name) {
    if (
      _apiMedia.origin_country &&
      _apiMedia.origin_country.includes("JP") &&
      _apiMedia.genre_ids.includes(16)
    ) {
      return "ANIME";
    } else return "TV";
  }

  return "UNKNOWN";
}
