import "./DashboardSkeleton.css";

export default function DashboardSkeleton() {
  return (
    <div className="skeleton-wrapper">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-line title"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line small"></div>
        </div>
      ))}
    </div>
  );
}
