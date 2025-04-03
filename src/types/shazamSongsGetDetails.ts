// To parse this data:
//
//   import { Convert, ShazamSongsGetDetails } from "./file";
//
//   const shazamSongsGetDetails = Convert.toShazamSongsGetDetails(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ShazamSongsGetDetails {
  data: Datum[];
  resources: Resources;
}

export interface Datum {
  id: string;
  type: string;
}

export interface Resources {
  'artist-highlights': ArtistHighlights;
  'track-highlights': TrackHighlights;
  'related-tracks': RelatedTracks;
  songs: Songs;
  albums: ResourcesAlbums;
  'shazam-artists': ShazamArtists;
  artists: Artists;
  lyrics: Lyrics;
  'shazam-songs': ShazamSongs;
}

export interface ResourcesAlbums {
  [p: string]: ResourcesAlbum;
}

export interface ResourcesAlbum {
  id: string;
  type: string;
  attributes: ResourcesAlbum_Attributes;
}

export interface ResourcesAlbum_Attributes {
  artistName: string;
  name: string;
  releaseDate: string;
}

export interface ArtistHighlights {
  [p: string]: Datum;
}

export interface Artists {
  [p: string]: Artist;
}

export interface Artist {
  id: string;
  attributes: Artist_Attributes;
  type: string;
}

export interface Artist_Attributes {
  name: string;
}

export interface Lyrics {
  [p: string]: Lyric;
}

export interface Lyric {
  id: string;
  type: string;
  attributes: Lyric_Attributes;
}

export interface Lyric_Attributes {
  text: string[];
  footer: string;
  musixmatchLyricsId: string;
  providerName: string;
  syncAvailable: boolean;
}

export interface RelatedTracks {
  //'track-similarities-id-811314261': Datum;
  [p: string]: Datum;
}

export interface ShazamArtists {
  [p: string]: Datum;
}

export interface ShazamSongs {
  [p: string]: ShazamSong;
}

export interface ShazamSong {
  id: string;
  type: string;
  attributes: ShazamSong_Attributes;
  relationships: Relationships;
}

export interface ShazamSong_Attributes {
  type: string;
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

export interface Relationships {
  'artist-highlights': ArtistHighlightsClass;
  'track-highlights': ArtistHighlightsClass;
  'related-tracks': ArtistHighlightsClass;
  songs: ArtistHighlightsClass;
  albums: ArtistHighlightsClass;
  'shazam-artists': ArtistHighlightsClass;
  artists: ArtistHighlightsClass;
  lyrics: ArtistHighlightsClass;
}

export interface ArtistHighlightsClass {
  data: Datum[];
}

export interface Songs {
  [p: string]: Song;
}

export interface Song {
  id: string;
  type: string;
  attributes: Song_Attributes;
}

export interface Song_Attributes {
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  unitags: Unitag[];
}

export interface Unitag {
  namespace: string;
  tag: string;
  score: number;
}

export interface TrackHighlights {
  [p: string]: Datum;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toShazamSongsGetDetails(json: string): ShazamSongsGetDetails {
    return cast(JSON.parse(json), r('ShazamSongsGetDetails'));
  }

  public static shazamSongsGetDetailsToJson(
    value: ShazamSongsGetDetails,
  ): string {
    return JSON.stringify(uncast(value, r('ShazamSongsGetDetails')), null, 2);
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

/*function u(...typs: any[]) {
  return { unionMembers: typs };
}*/

function o(props: any[], additional: any) {
  return { props, additional };
}

/*function m(additional: any) {
  return { props: [], additional };
}*/

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  ShazamSongsGetDetails: o(
    [
      { json: 'data', js: 'data', typ: a(r('Datum')) },
      { json: 'resources', js: 'resources', typ: r('Resources') },
    ],
    false,
  ),
  Datum: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: '' },
    ],
    false,
  ),
  Resources: o(
    [
      {
        json: 'artist-highlights',
        js: 'artist-highlights',
        typ: r('ArtistHighlights'),
      },
      {
        json: 'track-highlights',
        js: 'track-highlights',
        typ: r('TrackHighlights'),
      },
      { json: 'related-tracks', js: 'related-tracks', typ: r('RelatedTracks') },
      { json: 'songs', js: 'songs', typ: r('Songs') },
      { json: 'albums', js: 'albums', typ: r('ResourcesAlbums') },
      { json: 'shazam-artists', js: 'shazam-artists', typ: r('ShazamArtists') },
      { json: 'artists', js: 'artists', typ: r('Artists') },
      { json: 'lyrics', js: 'lyrics', typ: r('Lyrics') },
      { json: 'shazam-songs', js: 'shazam-songs', typ: r('ShazamSongs') },
    ],
    false,
  ),
  ResourcesAlbums: o(
    [{ json: '1792077173', js: '1792077173', typ: r('The1792077173') }],
    false,
  ),
  The1792077173: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      {
        json: 'attributes',
        js: 'attributes',
        typ: r('The1792077173_Attributes'),
      },
    ],
    false,
  ),
  The1792077173_Attributes: o(
    [
      { json: 'artistName', js: 'artistName', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'releaseDate', js: 'releaseDate', typ: '' },
    ],
    false,
  ),
  ArtistHighlights: o(
    [{ json: '425470694', js: '425470694', typ: r('Datum') }],
    false,
  ),
  Artists: o(
    [{ json: '425470694', js: '425470694', typ: r('The425470694') }],
    false,
  ),
  The425470694: o(
    [
      { json: 'id', js: 'id', typ: '' },
      {
        json: 'attributes',
        js: 'attributes',
        typ: r('The425470694_Attributes'),
      },
      { json: 'type', js: 'type', typ: '' },
    ],
    false,
  ),
  The425470694_Attributes: o([{ json: 'name', js: 'name', typ: '' }], false),
  Lyrics: o(
    [{ json: '37075224', js: '37075224', typ: r('The37075224') }],
    false,
  ),
  The37075224: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      {
        json: 'attributes',
        js: 'attributes',
        typ: r('The37075224_Attributes'),
      },
    ],
    false,
  ),
  The37075224_Attributes: o(
    [
      { json: 'text', js: 'text', typ: a('') },
      { json: 'footer', js: 'footer', typ: '' },
      { json: 'musixmatchLyricsId', js: 'musixmatchLyricsId', typ: '' },
      { json: 'providerName', js: 'providerName', typ: '' },
      { json: 'syncAvailable', js: 'syncAvailable', typ: true },
    ],
    false,
  ),
  RelatedTracks: o(
    [
      {
        json: 'track-similarities-id-811314261',
        js: 'track-similarities-id-811314261',
        typ: r('Datum'),
      },
    ],
    false,
  ),
  ShazamArtists: o([{ json: '42', js: '42', typ: r('Datum') }], false),
  ShazamSongs: o(
    [{ json: '811314261', js: '811314261', typ: r('The811314261') }],
    false,
  ),
  The811314261: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      {
        json: 'attributes',
        js: 'attributes',
        typ: r('The811314261_Attributes'),
      },
      { json: 'relationships', js: 'relationships', typ: r('Relationships') },
    ],
    false,
  ),
  The811314261_Attributes: o(
    [
      { json: 'type', js: 'type', typ: '' },
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
  Relationships: o(
    [
      {
        json: 'artist-highlights',
        js: 'artist-highlights',
        typ: r('ArtistHighlightsClass'),
      },
      {
        json: 'track-highlights',
        js: 'track-highlights',
        typ: r('ArtistHighlightsClass'),
      },
      {
        json: 'related-tracks',
        js: 'related-tracks',
        typ: r('ArtistHighlightsClass'),
      },
      { json: 'songs', js: 'songs', typ: r('ArtistHighlightsClass') },
      { json: 'albums', js: 'albums', typ: r('ArtistHighlightsClass') },
      {
        json: 'shazam-artists',
        js: 'shazam-artists',
        typ: r('ArtistHighlightsClass'),
      },
      { json: 'artists', js: 'artists', typ: r('ArtistHighlightsClass') },
      { json: 'lyrics', js: 'lyrics', typ: r('ArtistHighlightsClass') },
    ],
    false,
  ),
  ArtistHighlightsClass: o(
    [{ json: 'data', js: 'data', typ: a(r('Datum')) }],
    false,
  ),
  Songs: o(
    [{ json: '1792077176', js: '1792077176', typ: r('The1792077176') }],
    false,
  ),
  The1792077176: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      {
        json: 'attributes',
        js: 'attributes',
        typ: r('The1792077176_Attributes'),
      },
    ],
    false,
  ),
  The1792077176_Attributes: o(
    [
      { json: 'hasLyrics', js: 'hasLyrics', typ: true },
      { json: 'hasTimeSyncedLyrics', js: 'hasTimeSyncedLyrics', typ: true },
      { json: 'unitags', js: 'unitags', typ: a(r('Unitag')) },
    ],
    false,
  ),
  Unitag: o(
    [
      { json: 'namespace', js: 'namespace', typ: '' },
      { json: 'tag', js: 'tag', typ: '' },
      { json: 'score', js: 'score', typ: 3.14 },
    ],
    false,
  ),
  TrackHighlights: o(
    [{ json: '1792580847', js: '1792580847', typ: r('Datum') }],
    false,
  ),
};
