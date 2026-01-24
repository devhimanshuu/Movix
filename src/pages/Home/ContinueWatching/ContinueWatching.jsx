import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Carousel from "../../../components/Carousel/Carousel";

const ContinueWatching = () => {
  const history = useSelector((state) => state.history.items);

  if (!history || history.length === 0) {
    return null;
  }

  // Get last 10 watched items
  const recentItems = history.slice(0, 10);

  return (
    <Carousel
      title="Continue Watching"
      data={recentItems}
      endpoint={null}
      isLoading={false}
    />
  );
};

export default ContinueWatching;
