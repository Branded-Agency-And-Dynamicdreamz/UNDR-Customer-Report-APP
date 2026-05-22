import UnlockReportCta from './UnlockReportCta';

type OilContaminantsSectionProps = {
  status: string;
  value: string;
  locked?: boolean;
  lockedPreviewImageUrl?: string;
  unlockHref?: string;
  unlockLabel?: string;
  premiumUnlockHref?: string;
};

const OilContaminantsSection = ({
  status,
  value,
  locked = false,
  lockedPreviewImageUrl,
  unlockHref,
  unlockLabel = "Unlock report section",
  premiumUnlockHref,
}: OilContaminantsSectionProps) => {
  const displayStatus = status || "Not Detected";
  const displayValue = value || "0ppm";

  return (
    <section className="oil_contaminants_section">
      <div className="container">
        <h2 className="oil_main_heading">Oil Contaminants</h2>
        {locked && lockedPreviewImageUrl ? (
          <div className="report_unlock_preview">
            <img
              src={lockedPreviewImageUrl}
              alt=""
              className="oil_contaminants_locked_preview"
              aria-hidden="true"
            />
            <UnlockReportCta href={unlockHref} label={unlockLabel} premiumHref={premiumUnlockHref} />
          </div>
        ) : (
          <div className="oil_info_card">
            <div className="oil_card_content">
              <span className="oil_label">Crude oil:</span>
              <div className="oil_value_row">
                <span className="oil_found_text">{displayStatus}</span>
                <span className="oil_ppm_value">{displayValue}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OilContaminantsSection;
