// Photo-backed card stage: fills the whole card, keeps the photo visible,
// dims the left for copy, and hosts absolutely-positioned "anchor" children
// (rings, detection frames, glows) via the transparent scene layer.
export default function SceneStage({ image, veil = 'std', className = '', fx, fy, children }) {
  return (
    <div
      className={`scene-stage ${className}`}
      style={{ '--fx': fx ?? image.fx ?? 0.5, '--fy': fy ?? image.fy ?? 0.5 }}
    >
      <img
        className="scene-img"
        src={image.src}
        alt=""
        width={image.w}
        height={image.h}
        loading="lazy"
        aria-hidden="true"
      />
      <div className={`scene-veil ${veil}`} aria-hidden="true" />
      <div className="scene-layer">{children}</div>
    </div>
  );
}
