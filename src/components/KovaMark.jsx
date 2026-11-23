// The Kova brand mark — dark squircle with twin chevrons and the amber dot.
// Asset: public/images/kova/kova-mark.png (256px; 512px master in
// assets-src/kova/kova-mark.png). Decorative — always paired with the Kova
// name or used as a purely visual emblem.
export default function KovaMark({ size = 34, className = '' }) {
  return (
    <img
      src="/images/kova/kova-mark.png"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      draggable="false"
    />
  );
}
