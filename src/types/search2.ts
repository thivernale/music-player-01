// To parse this data:
//
//   import { Convert, Search2 } from "./file";
//
//   const search2 = Convert.toSearch2(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Search2 {
  results: Search2Results;
  meta: Search2Meta;
}

export interface Search2Meta {
  results: MetaResults;
  metrics: Metrics;
}

export interface Metrics {
  dataSetId: string;
}

export interface MetaResults {
  order: string[];
  rawOrder: string[];
}

export interface Search2Results {
  artists: Artists;
  songs: Songs;
}

export interface Artists {
  data: ArtistsDatum[];
}

export interface ArtistsDatum {
  id: string;
  type: string;
  attributes: PurpleAttributes;
  relationships: Relationships;
}

export interface PurpleAttributes {
  artwork: Artwork;
  genreNames: string[];
  name: string;
  url: string;
}

export interface Artwork {
  bgColor: string;
  hasP3: boolean;
  height: number;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  url: string;
  width: number;
}

export interface Relationships {
  albums: Albums;
}

export interface Albums {
  data: AlbumsDatum[];
}

export interface AlbumsDatum {
  id: string;
  type: Type;
}

export enum Type {
  Albums = 'albums',
}

export interface Songs {
  data: ArtistSong[];
}

export interface ArtistSong {
  id: string;
  type: string;
  attributes: ArtistSongAttributes;
  meta?: DatumMeta;
}

export interface ArtistSongAttributes {
  albumName: string;
  artistName: string;
  artwork: Artwork;
  audioLocale: string;
  audioTraits: AudioTrait[];
  composerName: string;
  contentRating?: string;
  discNumber: number;
  durationInMillis: number;
  genreNames: string[];
  hasLyrics: boolean;
  hasTimeSyncedLyrics: boolean;
  isAppleDigitalMaster: boolean;
  isMasteredForItunes: boolean;
  isVocalAttenuationAllowed: boolean;
  isrc: string;
  name: string;
  playParams: PlayParams;
  previews: Preview[];
  releaseDate: Date;
  trackNumber: number;
  url: string;
}

export enum AudioTrait {
  HiResLossless = 'hi-res-lossless',
  Lossless = 'lossless',
  LossyStereo = 'lossy-stereo',
}

export interface PlayParams {
  id: string;
  kind: string;
}

export interface Preview {
  url: string;
}

export interface DatumMeta {
  formerIds: string[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toSearch2(json: string): Search2 {
    return cast(JSON.parse(json), r('Search2'));
  }

  public static search2ToJson(value: Search2): string {
    return JSON.stringify(uncast(value, r('Search2')), null, 2);
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
  Search2: o(
    [
      { json: 'results', js: 'results', typ: r('Search2Results') },
      { json: 'meta', js: 'meta', typ: r('Search2Meta') },
    ],
    false,
  ),
  Search2Meta: o(
    [
      { json: 'results', js: 'results', typ: r('MetaResults') },
      { json: 'metrics', js: 'metrics', typ: r('Metrics') },
    ],
    false,
  ),
  Metrics: o([{ json: 'dataSetId', js: 'dataSetId', typ: '' }], false),
  MetaResults: o(
    [
      { json: 'order', js: 'order', typ: a('') },
      { json: 'rawOrder', js: 'rawOrder', typ: a('') },
    ],
    false,
  ),
  Search2Results: o(
    [
      { json: 'artists', js: 'artists', typ: r('Artists') },
      { json: 'songs', js: 'songs', typ: r('Songs') },
    ],
    false,
  ),
  Artists: o([{ json: 'data', js: 'data', typ: a(r('ArtistsDatum')) }], false),
  ArtistsDatum: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      { json: 'attributes', js: 'attributes', typ: r('PurpleAttributes') },
      { json: 'relationships', js: 'relationships', typ: r('Relationships') },
    ],
    false,
  ),
  PurpleAttributes: o(
    [
      { json: 'artwork', js: 'artwork', typ: r('Artwork') },
      { json: 'genreNames', js: 'genreNames', typ: a('') },
      { json: 'name', js: 'name', typ: '' },
      { json: 'url', js: 'url', typ: '' },
    ],
    false,
  ),
  Artwork: o(
    [
      { json: 'bgColor', js: 'bgColor', typ: '' },
      { json: 'hasP3', js: 'hasP3', typ: true },
      { json: 'height', js: 'height', typ: 0 },
      { json: 'textColor1', js: 'textColor1', typ: '' },
      { json: 'textColor2', js: 'textColor2', typ: '' },
      { json: 'textColor3', js: 'textColor3', typ: '' },
      { json: 'textColor4', js: 'textColor4', typ: '' },
      { json: 'url', js: 'url', typ: '' },
      { json: 'width', js: 'width', typ: 0 },
    ],
    false,
  ),
  Relationships: o([{ json: 'albums', js: 'albums', typ: r('Albums') }], false),
  Albums: o([{ json: 'data', js: 'data', typ: a(r('AlbumsDatum')) }], false),
  AlbumsDatum: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: r('Type') },
    ],
    false,
  ),
  Songs: o([{ json: 'data', js: 'data', typ: a(r('SongsDatum')) }], false),
  SongsDatum: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      { json: 'attributes', js: 'attributes', typ: r('FluffyAttributes') },
      { json: 'meta', js: 'meta', typ: u(undefined, r('DatumMeta')) },
    ],
    false,
  ),
  FluffyAttributes: o(
    [
      { json: 'albumName', js: 'albumName', typ: '' },
      { json: 'artistName', js: 'artistName', typ: '' },
      { json: 'artwork', js: 'artwork', typ: r('Artwork') },
      { json: 'audioLocale', js: 'audioLocale', typ: '' },
      { json: 'audioTraits', js: 'audioTraits', typ: a(r('AudioTrait')) },
      { json: 'composerName', js: 'composerName', typ: '' },
      { json: 'contentRating', js: 'contentRating', typ: u(undefined, '') },
      { json: 'discNumber', js: 'discNumber', typ: 0 },
      { json: 'durationInMillis', js: 'durationInMillis', typ: 0 },
      { json: 'genreNames', js: 'genreNames', typ: a('') },
      { json: 'hasLyrics', js: 'hasLyrics', typ: true },
      { json: 'hasTimeSyncedLyrics', js: 'hasTimeSyncedLyrics', typ: true },
      { json: 'isAppleDigitalMaster', js: 'isAppleDigitalMaster', typ: true },
      { json: 'isMasteredForItunes', js: 'isMasteredForItunes', typ: true },
      {
        json: 'isVocalAttenuationAllowed',
        js: 'isVocalAttenuationAllowed',
        typ: true,
      },
      { json: 'isrc', js: 'isrc', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'playParams', js: 'playParams', typ: r('PlayParams') },
      { json: 'previews', js: 'previews', typ: a(r('Preview')) },
      { json: 'releaseDate', js: 'releaseDate', typ: Date },
      { json: 'trackNumber', js: 'trackNumber', typ: 0 },
      { json: 'url', js: 'url', typ: '' },
    ],
    false,
  ),
  PlayParams: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'kind', js: 'kind', typ: '' },
    ],
    false,
  ),
  Preview: o([{ json: 'url', js: 'url', typ: '' }], false),
  DatumMeta: o([{ json: 'formerIds', js: 'formerIds', typ: a('') }], false),
  Type: ['albums'],
  AudioTrait: ['hi-res-lossless', 'lossless', 'lossy-stereo'],
};
