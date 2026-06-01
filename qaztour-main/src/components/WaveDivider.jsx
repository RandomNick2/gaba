

const WaveDivider = () => {
    return (
      <div style={{ height: "150px", overflow: "hidden" }}>
        <svg
          viewBox="0 0 500 150"
          preserveAspectRatio="none"
          style={{ height: "100%", width: "100%", display: "block" }}
        >
          <path
            d="M-2.54,95.23 C222.63,199.84 369.35,37.02 501.97,99.19 L500.00,150.00 L0.00,150.00 Z"
            style={{ stroke: "none", fill: "#08f" }}
          />
        </svg>
      </div>
    );
  };
  
  export default WaveDivider;
  