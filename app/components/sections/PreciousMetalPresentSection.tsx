import DiveArrow from './DiveArrow';
import UnlockReportCta from './UnlockReportCta';
import type { PreciousMetalGraphItem } from '../../lib/proxy-report-data';

type PreciousMetalPresentSectionProps = {
  items: PreciousMetalGraphItem[];
  locked?: boolean;
  lockedPreviewImageUrl: string;
  unlockHref?: string;
  unlockLabel?: string;
  premiumUnlockHref?: string;
};

const PreciousMetalPresentSection = ({
  items,
  locked = false,
  lockedPreviewImageUrl,
  unlockHref,
  unlockLabel = "Unlock report section",
  premiumUnlockHref,
}: PreciousMetalPresentSectionProps) => {
  const canShowPreciousMetalsChart = items.length > 0 && items.every((item) => Number(item.ppm) > 0);

  return (
    <section
      className={`precious_metal_present_section${locked ? ' locked' : ''}${!locked && !canShowPreciousMetalsChart ? ' zero_state' : ''}`}
      data-item-count={items.length}
    >
      <div className="container">
        {locked ? (
          <div className="report_unlock_preview">
            <img
              src={lockedPreviewImageUrl}
              alt=""
              className="precious_metal_locked_preview"
              aria-hidden="true"
            />
            <UnlockReportCta href={unlockHref} label={unlockLabel} premiumHref={premiumUnlockHref} />
          </div>
        ) : !canShowPreciousMetalsChart ? (
          <div className="precious_zero_state_content">
            <div className="precious_zero_value">0</div>
            <div className="precious_zero_copy">
              <span className="precious_zero_unit">ppm</span>
              <h3>Precious Metals Not Detected</h3>
              <p>
                The good news? The rest of your report still has plenty to dig into.
              </p>
              <p>
                And don't trade in your shovel just yet--the next scoop could tell a different story.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="header_content">
              <h2 className="main_title">Precious Metals<br /> Present!</h2>
              <p className="sub_text">Detected in your sample<br /> at trace levels</p>
            </div>
            <div className="graph_container" id="graph_wrapper">
              <div className="graph_bar_wrapper" id="master_bar_layout" style={{ display: 'none' }}>
                <div className="bar_body">
                  <span className="ppm_value"></span>
                </div>
                <div className="label_container">
                  <span className="metal_full_name"></span>
                  <span className="metal_short_symbol"></span>
                </div>
              </div>
            </div>
            <div className="report_details_section">
              <div className="dive_deeper_wrap">
                <p className="dive_text">More below</p>
                <div className="dive_arrow"><DiveArrow /></div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PreciousMetalPresentSection;
