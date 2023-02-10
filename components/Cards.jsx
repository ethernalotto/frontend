function formatNumber(value) {
  return ('0' + value).slice(-2);
}

const Card = ({date, children, onDetails}) => (
  <div className="draws__item">
    <div className="draws__frame">
      <div className="draws__date">
        {formatNumber(date.getDate())}.{formatNumber(date.getMonth() + 1)}.{formatNumber(date.getFullYear())}
      </div>
      <div className="draws__main-shadow">
        <div className="draws__main">
          {children}
        </div>
        {onDetails ? (
          <div className="draws__buttons">
            <button className="btn btn-details" onClick={onDetails}>
              <span className="btn-details__text">More Details</span>
              <span className="btn-details__shadow"></span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);


Card.Jackpot = ({jackpot}) => (
  <div className="draws__jackpot">
    <div className="draws__jackpot-frame">
      <div className="draws__jackpot-title">Jackpot</div>
      <div className="draws__jackpot-container">
        <div className="draws__jackpot-number">
          {Math.floor(jackpot * 100) / 100} ETH
        </div>
      </div>
    </div>
  </div>
);


Card.Numbers = ({title, numbers, highlightedNumbers}) => (
  <div className="my-numbers__out">
    <div className="my-numbers">
      <div className="my-numbers__title">{title}</div>
      <div className="my-numbers__body">
        {numbers.map((number, index) => {
          const selected = highlightedNumbers?.includes(number);
          return (
            <div key={index} className={'my-numbers__item' + (selected ? ' my-numbers__item--selected' : '')}>
              <span className="my-numbers__text">{number}</span>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

Card.Numbers.defaultProps = {
  highlightedNumbers: [],
};


Card.NoWin = () => (
  <div className="prize prize--empty">
    <span className="prize__text">No Win!</span>
  </div>
);

Card.Prize = () => (
  <div className="prize">
    <div className="prize__title">You Won!</div>
  </div>
);


export default Card;
