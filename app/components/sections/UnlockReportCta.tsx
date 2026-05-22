type UnlockReportCtaProps = {
  href?: string;
  label: string;
  premiumHref?: string;
};

const UnlockReportCta = ({ href, label, premiumHref }: UnlockReportCtaProps) => {
  if (!href) return null;

  return (
    <div className="report_unlock_cta">
      <a href={href} className="report_unlock_button">
        {label}
      </a>
      {premiumHref ? (
        <a href={premiumHref} className="report_unlock_secondary">
          Upgrade to Premium for $149
        </a>
      ) : null}
    </div>
  );
};

export default UnlockReportCta;
