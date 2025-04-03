// To parse this data:
//
//   import { Convert, Search } from "./file";
//
//   const search = Convert.toSearch(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Search {
  tracks: Tracks;
  artists: Artists;
}

export interface Artists {
  hits: ArtistsHit[];
}

export interface ArtistsHit {
  artist: HitArtist;
}

export interface HitArtist {
  avatar: string;
  name: string;
  verified: boolean;
  weburl: string;
  adamid: string;
}

export interface Tracks {
  hits: TracksHit[];
}

export interface TracksHit {
  track: Track;
}

export interface Track {
  layout: string;
  type: string;
  key: string;
  title: string;
  subtitle: string;
  share: Share;
  images: TrackImages;
  hub: Hub;
  artists: ArtistElement[];
  url: string;
}

export interface ArtistElement {
  id: string;
  adamid: string;
}

export interface Hub {
  type: string;
  image: string;
  actions: Action[];
  providers: Provider[];
  explicit: boolean;
  displayname: string;
  options: Option[];
}

export interface Action {
  name?: string;
  type: string;
  id?: string;
  uri?: string;
}

export interface Option {
  caption: string;
  actions: Action[];
  beacondata: Beacondata;
  image: string;
  type: string;
  listcaption: string;
  overflowimage: string;
  colouroverflowimage: boolean;
  providername: string;
}

export interface Beacondata {
  type: string;
  providername: string;
}

export interface Provider {
  caption: string;
  images: ProviderImages;
  actions: Action[];
  type: string;
}

export interface ProviderImages {
  overflow: string;
  default: string;
}

export interface TrackImages {
  background: string;
  coverart: string;
  coverarthq: string;
  joecolor: string;
}

export interface Share {
  subject: string;
  text: string;
  href: string;
  image: string;
  twitter: string;
  html: string;
  avatar: string;
  snapchat: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toSearch(json: string): Search {
    return cast(JSON.parse(json), r('Search'));
  }

  public static searchToJson(value: Search): string {
    return JSON.stringify(uncast(value, r('Search')), null, 2);
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

/*function m(additional: any) {
  return { props: [], additional };
}*/

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Search: o(
    [
      { json: 'tracks', js: 'tracks', typ: r('Tracks') },
      { json: 'artists', js: 'artists', typ: r('Artists') },
    ],
    false,
  ),
  Artists: o([{ json: 'hits', js: 'hits', typ: a(r('ArtistsHit')) }], false),
  ArtistsHit: o([{ json: 'artist', js: 'artist', typ: r('HitArtist') }], false),
  HitArtist: o(
    [
      { json: 'avatar', js: 'avatar', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'verified', js: 'verified', typ: true },
      { json: 'weburl', js: 'weburl', typ: '' },
      { json: 'adamid', js: 'adamid', typ: '' },
    ],
    false,
  ),
  Tracks: o([{ json: 'hits', js: 'hits', typ: a(r('TracksHit')) }], false),
  TracksHit: o([{ json: 'track', js: 'track', typ: r('Track') }], false),
  Track: o(
    [
      { json: 'layout', js: 'layout', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      { json: 'key', js: 'key', typ: '' },
      { json: 'title', js: 'title', typ: '' },
      { json: 'subtitle', js: 'subtitle', typ: '' },
      { json: 'share', js: 'share', typ: r('Share') },
      { json: 'images', js: 'images', typ: r('TrackImages') },
      { json: 'hub', js: 'hub', typ: r('Hub') },
      { json: 'artists', js: 'artists', typ: a(r('ArtistElement')) },
      { json: 'url', js: 'url', typ: '' },
    ],
    false,
  ),
  ArtistElement: o(
    [
      { json: 'id', js: 'id', typ: '' },
      { json: 'adamid', js: 'adamid', typ: '' },
    ],
    false,
  ),
  Hub: o(
    [
      { json: 'type', js: 'type', typ: '' },
      { json: 'image', js: 'image', typ: '' },
      { json: 'actions', js: 'actions', typ: a(r('Action')) },
      { json: 'providers', js: 'providers', typ: a(r('Provider')) },
      { json: 'explicit', js: 'explicit', typ: true },
      { json: 'displayname', js: 'displayname', typ: '' },
      { json: 'options', js: 'options', typ: a(r('Option')) },
    ],
    false,
  ),
  Action: o(
    [
      { json: 'name', js: 'name', typ: u(undefined, '') },
      { json: 'type', js: 'type', typ: '' },
      { json: 'id', js: 'id', typ: u(undefined, '') },
      { json: 'uri', js: 'uri', typ: u(undefined, '') },
    ],
    false,
  ),
  Option: o(
    [
      { json: 'caption', js: 'caption', typ: '' },
      { json: 'actions', js: 'actions', typ: a(r('Action')) },
      { json: 'beacondata', js: 'beacondata', typ: r('Beacondata') },
      { json: 'image', js: 'image', typ: '' },
      { json: 'type', js: 'type', typ: '' },
      { json: 'listcaption', js: 'listcaption', typ: '' },
      { json: 'overflowimage', js: 'overflowimage', typ: '' },
      { json: 'colouroverflowimage', js: 'colouroverflowimage', typ: true },
      { json: 'providername', js: 'providername', typ: '' },
    ],
    false,
  ),
  Beacondata: o(
    [
      { json: 'type', js: 'type', typ: '' },
      { json: 'providername', js: 'providername', typ: '' },
    ],
    false,
  ),
  Provider: o(
    [
      { json: 'caption', js: 'caption', typ: '' },
      { json: 'images', js: 'images', typ: r('ProviderImages') },
      { json: 'actions', js: 'actions', typ: a(r('Action')) },
      { json: 'type', js: 'type', typ: '' },
    ],
    false,
  ),
  ProviderImages: o(
    [
      { json: 'overflow', js: 'overflow', typ: '' },
      { json: 'default', js: 'default', typ: '' },
    ],
    false,
  ),
  TrackImages: o(
    [
      { json: 'background', js: 'background', typ: '' },
      { json: 'coverart', js: 'coverart', typ: '' },
      { json: 'coverarthq', js: 'coverarthq', typ: '' },
      { json: 'joecolor', js: 'joecolor', typ: '' },
    ],
    false,
  ),
  Share: o(
    [
      { json: 'subject', js: 'subject', typ: '' },
      { json: 'text', js: 'text', typ: '' },
      { json: 'href', js: 'href', typ: '' },
      { json: 'image', js: 'image', typ: '' },
      { json: 'twitter', js: 'twitter', typ: '' },
      { json: 'html', js: 'html', typ: '' },
      { json: 'avatar', js: 'avatar', typ: '' },
      { json: 'snapchat', js: 'snapchat', typ: '' },
    ],
    false,
  ),
};
