const languages = [
  { title: "Malayalam Cinema", code: "ml", region: "India" },
  { title: "Telugu Movies", code: "te", region: "India" },
  { title: "Tamil Films", code: "ta", region: "India" },
  { title: "Korean Cinema", code: "ko", region: "Asia" },
  { title: "Japanese Films", code: "ja", region: "Asia" },
  { title: "Chinese Cinema", code: "zh", region: "Asia" },
  { title: "Thai Cinema", code: "th", region: "Asia" },
  { title: "French Cinema", code: "fr", region: "Europe" },
  { title: "Spanish Cinema", code: "es", region: "Europe" },
  { title: "German Cinema", code: "de", region: "Europe" },
  { title: "Italian Cinema", code: "it", region: "Europe" },
  { title: "Portuguese Cinema", code: "pt", region: "Europe" },
  { title: "Turkish Cinema", code: "tr", region: "Europe" },
];

export const regions = [...new Set(languages.map((l) => l.region))];

export default languages;
