import { openReverseGeocoder } from "@geolonia/open-reverse-geocoder";
import { PREFECTURE_MAPPING } from "./prefectureMap";

type geocode = {
  code: string;
  prefecture: string;
  city: string;
};

type CityCodeRes = {
  cityCode: string;
  prefectureEnglish: string;
};

// 緯度経度から市町村コードと都道府県のローマ字名を取得する関数
const getPrefecture = async (
  lat: number,
  lng: number
): Promise<CityCodeRes> => {
  // ライブラリの仕様？で経度・緯度の順番で渡しているので注意
  const geocode: geocode = await openReverseGeocoder([lng, lat]);
  if (!geocode) {
    throw new Error("Geocode not found");
  }
  const cityCode = geocode.code;
  const prefecture = geocode.prefecture;
  const prefectureEnglish = PREFECTURE_MAPPING[prefecture];
  return { cityCode, prefectureEnglish };
};

export const generateTabelogURL = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const { cityCode, prefectureEnglish } = await getPrefecture(lat, lng);
    const resultURL = `https://tabelog.com/${prefectureEnglish}/C${cityCode}/rstLst/`;
    return resultURL;
  } catch (error) {
    console.error("Error generating URL:", error);
    throw error;
  }
};
