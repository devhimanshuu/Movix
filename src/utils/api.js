import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYjYwYTViZjNhNWQxODM3MmI2NDY5ZDE0NDFkY2VkZSIsInN1YiI6IjY1ZTBmOTc1MmQ1MzFhMDE4NWMwYWQ5YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vqCbFx1kUZF50TNkWYgjZZ52UDimUWLYwBRHn57tXyM";

const headers = {
  Authorization: "bearer " + TMDB_TOKEN,
};

export const fetchDataFromApi = async (url, params) => {
  try {
    const { data } = await axios.get(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
