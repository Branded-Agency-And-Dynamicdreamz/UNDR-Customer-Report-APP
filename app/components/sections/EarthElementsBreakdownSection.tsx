type EarthElementsBreakdownSectionProps = {
  locked?: boolean;
  lockedPreviewImageUrl: string;
};

const EarthElementsBreakdownSection = ({
  locked = false,
  lockedPreviewImageUrl,
}: EarthElementsBreakdownSectionProps) => {
  return (
    <section className={`earth_element_breakdown_section${locked ? ' locked' : ''}`}>
      <div className="container">
        <div className="text_center_header">
          <h2 className="main_title">Rare Earth Elements Breakdown</h2>
          <p className="sub_title">Traces found in your land sample</p>
        </div>
        {locked ? (
          <img
            src={lockedPreviewImageUrl}
            alt=""
            className="earth_element_locked_preview"
            aria-hidden="true"
          />
        ) : (
          <div id="chart_wrapper" className="chart_wrapper"></div>
        )}
      </div>
    </section>
  );
};

export default EarthElementsBreakdownSection;
