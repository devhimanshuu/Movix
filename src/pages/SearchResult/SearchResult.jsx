import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import "./style.scss";
import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/MovieCard/MovieCard";
import SearchFilters from "../../components/SearchFilters/SearchFilters";
import noResults from "../../assets/no-results.png";
import Spinner from "../../components/Spinner/Spinner";

const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();
  const filters = useSelector((state) => state.searchFilters);

  const fetchIntialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        setData(res);
        setPageNum((prev) => prev + 1);
        setLoading(false);
      }
    );
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...data?.results, ...res.results],
          });
        } else {
          setData(res);
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  // Filter results based on active filters
  const getFilteredResults = () => {
    if (!data?.results) return [];

    return data.results.filter((item) => {
      // Type filter
      const mediaType = item.media_type || "movie";
      if (filters.mediaType !== "all" && mediaType !== filters.mediaType) {
        return false;
      }

      // Year filter
      const releaseYear = item.release_date || item.first_air_date;
      if (releaseYear) {
        const year = parseInt(releaseYear.split("-")[0]);
        if (year < filters.yearRange.min || year > filters.yearRange.max) {
          return false;
        }
      }

      // Rating filter
      const rating = item.vote_average || 0;
      if (rating < filters.ratingRange.min || rating > filters.ratingRange.max) {
        return false;
      }

      return true;
    });
  };

  useEffect(() => {
    setPageNum(1);
    fetchIntialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search${
                  data.total_results > 1 ? "results" : "result"
                } of  "${query}"`}
              </div>
              <SearchFilters />
              <InfiniteScroll
                className="content"
                dataLength={getFilteredResults().length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {getFilteredResults().length > 0 ? (
                  getFilteredResults().map((item, index) => {
                    if (item.media_type === "person") return null;
                    return (
                      <MovieCard
                        key={index}
                        data={item}
                        fromSearch={true}
                      ></MovieCard>
                    );
                  })
                ) : (
                  <span className="resultNotFound">
                    No results match your filters. Try adjusting your search criteria.
                  </span>
                )}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound"> Sorry, Results not Found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;
