// To parse this data:
//
//   import { Convert, ShazamSongsListSimilarities } from "./file";
//
//   const shazamSongsListSimilarities = Convert.toShazamSongsListSimilarities(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ShazamSongsListSimilarities {
  data: Datum[];
  resources: Resources;
}

export interface Datum {
  id: string;
  type: DatumType;
}

export enum DatumType {
  Albums = 'albums',
  ArtistHighlights = 'artist-highlights',
  Artists = 'artists',
  Lyrics = 'lyrics',
  RelatedTracks = 'related-tracks',
  ShazamArtists = 'shazam-artists',
  ShazamSongLists = 'shazam-song-lists',
  ShazamSongs = 'shazam-songs',
  Songs = 'songs',
  TrackHighlights = 'track-highlights',
}

export interface Resources {
  'shazam-song-lists': ShazamSongLists;
  'track-highlights': { [key: string]: Datum };
  songs: { [key: string]: Song };
  'shazam-artists': ShazamArtists;
  'artist-highlights': { [key: string]: Datum };
  lyrics: { [key: string]: Lyric };
  'related-tracks': { [key: string]: Datum };
  albums: { [key: string]: Album };
  artists: { [key: string]: Artist };
  'shazam-songs': { [key: string]: ShazamSong };
}

export interface Album {
  id: string;
  type: DatumType;
  attributes: AlbumAttributes;
}

export interface AlbumAttributes {
  artistName: string;
  name: string;
  releaseDate: string;
}

export interface Artist {
  id: string;
  attributes: ArtistAttributes;
  type: DatumType;
}

export interface ArtistAttributes {
  name: string;
}

export interface Lyric {
  id: string;
  type: DatumType;
  attributes: LyricAttributes;
}

export interface LyricAttributes {
  text: string[];
  footer: string;
  musixmatchLyricsId: string;
  providerName: string;
  syncAvailable: boolean;
}

export interface ShazamArtists {
  '42': Datum;
}

export interface ShazamSongLists {
  'track-similarities-id-811314261': TrackSimilaritiesID811314261;
}

export interface TrackSimilaritiesID811314261 {
  id: string;
  type: DatumType;
  relationships: TrackSimilaritiesID811314261_Relationships;
}

export interface TrackSimilaritiesID811314261_Relationships {
  tracks: Tracks;
}

export interface Tracks {
  data: Datum[];
}

export interface ShazamSong {
  id: string;
  type: DatumType;
  attributes: ShazamSongAttributes;
  relationships: ShazamSongRelationships;
}

export interface ShazamSongAttributes {
  type: AttributesType;
  title: string;
  artist: string;
  primaryArtist: string;
  label: string;
  explicit: boolean;
  isrc: string;
  webUrl: string;
  images: Images;
  artwork: Artwork;
  share: Share;
  genres: Genres;
  streaming: Streaming;
  classicalAvailability: boolean;
}

export interface Artwork {
  url: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  bgColor: string;
}

export interface Genres {
  primary: string;
}

export interface Images {
  artistAvatar: string;
  coverArt: string;
  coverArtHq: string;
}

export interface Share {
  subject: string;
  text: string;
  image: string;
  twitter: string;
  html: string;
  snapchat: string;
}

export interface Streaming {
  preview: string;
  deeplink: string;
  store: string;
}

export enum AttributesType {
  Music = 'MUSIC',
}

export interface ShazamSongRelationships {
  'artist-highlights': Tracks;
  'related-tracks': Tracks;
  songs: Tracks;
  albums: Tracks;
  'shazam-artists': Tracks;
  artists: Tracks;
  lyrics?: Tracks;
  'track-highlights'?: Tracks;
}

export interface Song {
  id: string;
  type: DatumType;
  attributes: SongAttributes;
}

export interface SongAttributes {
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  unitags: Unitag[];
}

export interface Unitag {
  namespace: Namespace;
  tag: string;
  score: number;
}

export enum Namespace {
  EditorialEra = 'EditorialEra',
  EditorialGenres = 'EditorialGenres',
  EditorialMoodsAndActivities = 'EditorialMoodsAndActivities',
  MemoryAppropriateness = 'MemoryAppropriateness',
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toShazamSongsListSimilarities(
    json: string,
  ): ShazamSongsListSimilarities {
    return cast(JSON.parse(json), r('ShazamSongsListSimilarities'));
  }

  public static shazamSongsListSimilaritiesToJson(
    value: ShazamSongsListSimilarities,
  ): string {
    return JSON.stringify(
      uncast(value, r('ShazamSongsListSimilarities')),
      null,
      2,
    );
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : '';
  const keyText = key ? ` for key "${key}"` : '';
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(', ')}]`;
    }
  } else if (typeof typ === 'object' && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = '',
  parent: any = '',
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l('Date'), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue(l(ref || 'object'), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === 'object' && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty('props')
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  ShazamSongsListSimilarities: o(
    [
      { json: 'data', js: 'data', typ: a(r('Datum')) },
      { json: 'resources', js: 'resources', typ: r('Resources') },
    ],
    false,
  ),
  Datum: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('DatumType') },
    ],
    false,
  ),
  Resources: o(
    [
      {
        json: 'shazam-song-lists',
        js: 'shazam-song-lists',
        typ: r('ShazamSongLists'),
      },
      { json: 'track-highlights', js: 'track-highlights', typ: m(r('Datum')) },
      { json: 'songs', js: 'songs', typ: m(r('Song')) },
      { json: 'shazam-artists', js: 'shazam-artists', typ: r('ShazamArtists') },
      {
        json: 'artist-highlights',
        js: 'artist-highlights',
        typ: m(r('Datum')),
      },
      { json: 'lyrics', js: 'lyrics', typ: m(r('Lyric')) },
      { json: 'related-tracks', js: 'related-tracks', typ: m(r('Datum')) },
      { json: 'albums', js: 'albums', typ: m(r('Album')) },
      { json: 'artists', js: 'artists', typ: m(r('Artist')) },
      { json: 'shazam-songs', js: 'shazam-songs', typ: m(r('ShazamSong')) },
    ],
    false,
  ),
  Album: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('DatumType') },
      { json: 'attributes', js: 'attributes', typ: r('AlbumAttributes') },
    ],
    false,
  ),
  AlbumAttributes: o(
    [
      { json: 'artistName', js: 'artistName', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'releaseDate', js: 'releaseDate', typ: '' },
    ],
    false,
  ),
  Artist: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'attributes', js: 'attributes', typ: r('ArtistAttributes') },
      { json: 'type', js: 'type', typ: r('DatumType') },
    ],
    false,
  ),
  ArtistAttributes: o([{ json: 'name', js: 'name', typ: '' }], false),
  Lyric: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('DatumType') },
      { json: 'attributes', js: 'attributes', typ: r('LyricAttributes') },
    ],
    false,
  ),
  LyricAttributes: o(
    [
      { json: 'text', js: 'text', typ: a('') },
      { json: 'footer', js: 'footer', typ: '' },
      { json: 'musixmatchLyricsId', js: 'musixmatchLyricsId', typ: '' },
      { json: 'providerName', js: 'providerName', typ: r('ProviderName') },
      { json: 'syncAvailable', js: 'syncAvailable', typ: true },
    ],
    false,
  ),
  ShazamArtists: o([{ json: '42', js: '42', typ: r('Datum') }], false),
  ShazamSongLists: o(
    [
      {
        json: 'track-similarities-id-811314261',
        js: 'track-similarities-id-811314261',
        typ: r('TrackSimilaritiesID811314261'),
      },
    ],
    false,
  ),
  TrackSimilaritiesID811314261: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('DatumType') },
      {
        json: 'relationships',
        js: 'relationships',
        typ: r('TrackSimilaritiesID811314261_Relationships'),
      },
    ],
    false,
  ),
  TrackSimilaritiesID811314261_Relationships: o(
    [{ json: 'tracks', js: 'tracks', typ: r('Tracks') }],
    false,
  ),
  Tracks: o([{ json: 'data', js: 'data', typ: a(r('Datum')) }], false),
  ShazamSong: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('DatumType') },
      { json: 'attributes', js: 'attributes', typ: r('ShazamSongAttributes') },
      {
        json: 'relationships',
        js: 'relationships',
        typ: r('ShazamSongRelationships'),
      },
    ],
    false,
  ),
  ShazamSongAttributes: o(
    [
      { json: 'type', js: 'type', typ: r('AttributesType') },
      { json: 'title', js: 'title', typ: '' },
      { json: 'artist', js: 'artist', typ: '' },
      { json: 'primaryArtist', js: 'primaryArtist', typ: '' },
      { json: 'label', js: 'label', typ: '' },
      { json: 'explicit', js: 'explicit', typ: true },
      { json: 'isrc', js: 'isrc', typ: '' },
      { json: 'webUrl', js: 'webUrl', typ: '' },
      { json: 'images', js: 'images', typ: r('Images') },
      { json: 'artwork', js: 'artwork', typ: r('Artwork') },
      { json: 'share', js: 'share', typ: r('Share') },
      { json: 'genres', js: 'genres', typ: r('Genres') },
      { json: 'streaming', js: 'streaming', typ: r('Streaming') },
      { json: 'classicalAvailability', js: 'classicalAvailability', typ: true },
    ],
    false,
  ),
  Artwork: o(
    [
      { json: 'url', js: 'url', typ: '' },
      { json: 'textColor1', js: 'textColor1', typ: '' },
      { json: 'textColor2', js: 'textColor2', typ: '' },
      { json: 'textColor3', js: 'textColor3', typ: '' },
      { json: 'textColor4', js: 'textColor4', typ: '' },
      { json: 'bgColor', js: 'bgColor', typ: '' },
    ],
    false,
  ),
  Genres: o([{ json: 'primary', js: 'primary', typ: '' }], false),
  Images: o(
    [
      { json: 'artistAvatar', js: 'artistAvatar', typ: '' },
      { json: 'coverArt', js: 'coverArt', typ: '' },
      { json: 'coverArtHq', js: 'coverArtHq', typ: '' },
    ],
    false,
  ),
  Share: o(
    [
      { json: 'subject', js: 'subject', typ: '' },
      { json: 'text', js: 'text', typ: '' },
      { json: 'image', js: 'image', typ: '' },
      { json: 'twitter', js: 'twitter', typ: '' },
      { json: 'html', js: 'html', typ: '' },
      { json: 'snapchat', js: 'snapchat', typ: '' },
    ],
    false,
  ),
  Streaming: o(
    [
      { json: 'preview', js: 'preview', typ: '' },
      { json: 'deeplink', js: 'deeplink', typ: '' },
      { json: 'store', js: 'store', typ: '' },
    ],
    false,
  ),
  ShazamSongRelationships: o(
    [
      { json: 'artist-highlights', js: 'artist-highlights', typ: r('Tracks') },
      { json: 'related-tracks', js: 'related-tracks', typ: r('Tracks') },
      { json: 'songs', js: 'songs', typ: r('Tracks') },
      { json: 'albums', js: 'albums', typ: r('Tracks') },
      { json: 'shazam-artists', js: 'shazam-artists', typ: r('Tracks') },
      { json: 'artists', js: 'artists', typ: r('Tracks') },
      { json: 'lyrics', js: 'lyrics', typ: u(undefined, r('Tracks')) },
      {
        json: 'track-highlights',
        js: 'track-highlights',
        typ: u(undefined, r('Tracks')),
      },
    ],
    false,
  ),
  Song: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('DatumType') },
      { json: 'attributes', js: 'attributes', typ: r('SongAttributes') },
    ],
    false,
  ),
  SongAttributes: o(
    [
      { json: 'hasLyrics', js: 'hasLyrics', typ: true },
      { json: 'hasTimeSyncedLyrics', js: 'hasTimeSyncedLyrics', typ: true },
      { json: 'unitags', js: 'unitags', typ: a(r('Unitag')) },
    ],
    false,
  ),
  Unitag: o(
    [
      { json: 'namespace', js: 'namespace', typ: r('Namespace') },
      { json: 'tag', js: 'tag', typ: '' },
      { json: 'score', js: 'score', typ: 3.14 },
    ],
    false,
  ),
  DatumType: [
    'albums',
    'artist-highlights',
    'artists',
    'lyrics',
    'related-tracks',
    'shazam-artists',
    'shazam-song-lists',
    'shazam-songs',
    'songs',
    'track-highlights',
  ],
  ProviderName: ['musixmatch'],
  AttributesType: ['MUSIC'],
  Namespace: [
    'EditorialEra',
    'EditorialGenres',
    'EditorialMoodsAndActivities',
    'MemoryAppropriateness',
  ],
};
