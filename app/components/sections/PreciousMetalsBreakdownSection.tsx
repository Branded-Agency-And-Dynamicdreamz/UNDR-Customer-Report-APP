type PreciousMetalsBreakdownSectionProps = {
  appUrl?: string;
};

const PreciousMetalsBreakdownSection = ({ appUrl = '' }: PreciousMetalsBreakdownSectionProps) => {
  return (
    <section className="break heavy_metal_breakdown_section precious_metal_breakdown_section">
      <div className="container">
        <div className="heavy_metal_inner_wrapper">
          <div className="heavy_metal_content_left">
            <h2 className="heavy_metal_title">Precious Metals<br />Breakdown</h2>
          </div>
        </div>
      </div>
      
      <img src={`${appUrl ? appUrl : ''}/images/PMB-outside-icon.svg`} className="pmb_outside_icon" alt="Icon" />

      <img src={`${appUrl ? appUrl : ''}/images/PMB-inside-icon.svg`} className="pmb_inside_icon" alt="Icon" />

    </section>
  );
};

export default PreciousMetalsBreakdownSection;
