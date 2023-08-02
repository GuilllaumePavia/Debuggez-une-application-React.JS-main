import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [byDateDesc, setByDateDesc] = useState([]);
  const [intervalId, setIntervalId] = useState();
  const [isDelayed, setIsDelayed] = useState(false);

  const changeSlide = (newIndex) => {
    setIsDelayed(true);
    setIndex(newIndex);
  };
  useEffect(() => {
    if (data?.focus) {
      setByDateDesc(
        data.focus.sort((evtA, evtB) =>
          new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
        )
      );
    }
  }, [data]);
  const startSlider = () => {
    clearInterval(intervalId);
    setIntervalId(
      setInterval(() => {
        setIndex((prevIndex) =>
          prevIndex + 1 < byDateDesc?.length ? prevIndex + 1 : 0
        );
      }, 3000)
    );
  };
  useEffect(() => {
    let timeoutId;

    if (isDelayed) {
      timeoutId = setTimeout(() => {
        setIsDelayed(false);
        startSlider();
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isDelayed]);

  useEffect(() => {
    if (byDateDesc.length > 0) {
      startSlider();
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [byDateDesc]);
  return (
    <div className="SlideCardList" key={index}>
      {byDateDesc?.map((event, idx) => (
        <div key={event.title}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>

                <div>{getMonth(new Date(event.date))}</div>
                {/* {index === 2 && <div>{(new Date(event.date))} </div>} */}
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  key={_.date}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  onChange={() => {
                    changeSlide(radioIdx);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;

