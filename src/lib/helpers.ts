export function _getConvertedMediaType(_apiMedia: any) {

  if(_apiMedia.mediaType) return _apiMedia.mediaType

  if(!_apiMedia.genre_ids && !_apiMedia.genres) return;

  const genreIds = _apiMedia.genre_ids || _apiMedia.genres.map((genre: any) => genre.id);

  if (_apiMedia.media_type && _apiMedia.media_type === "movie") return "FILM";
  if (_apiMedia.media_type && _apiMedia.media_type === "tv") {
    // Check for attributes of anime
    if (
      _apiMedia.origin_country &&
      _apiMedia.origin_country.includes("JP") &&
      genreIds.includes(16)
    ) {
      return "ANIME";
    } else return "TV";
  }

  // If media_type doesn't exist in API data, get media type from certain data fields.
  if (!_apiMedia.media_type && _apiMedia.title) return "FILM";
  if (!_apiMedia.media_type && _apiMedia.name) {
    if (
      _apiMedia.origin_country &&
      _apiMedia.origin_country.includes("JP") &&
      genreIds.includes(16)
    ) {
      return "ANIME";
    } else return "TV";
  }

  return "UNKNOWN";
}
