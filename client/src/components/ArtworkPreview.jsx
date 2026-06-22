import './ArtworkPreview.css';

export default function ArtworkPreview({ artwork }) {
  return (
    <div className="artwork-preview">
      <div className="preview-card">
        <h2>{artwork?.title}</h2>
        <p className="artist">{artwork?.artist}</p>
        <div className="preview-content">
          <div className="artwork-icon">🖼️</div>
          <p className="preview-text">Take a good look!</p>
        </div>
        <div className="difficulty-badge" data-difficulty={artwork?.difficulty}>
          {artwork?.difficulty}
        </div>
      </div>
    </div>
  );
}
