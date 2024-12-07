export function initiateAutoResize() {
  const container = document.querySelector('#root'); // Or any top-level container
  let prevHeight = 0;

  const resizeObserver = new ResizeObserver(() => {
    const height = container.scrollHeight;
    if (Math.abs(height - prevHeight) > 5) {
      console.log("Sending resize message with height:", height);

      window.parent.postMessage(
        {
          height: height,
          source: "insendi-activity-resize",
        },
        "*"
      );

      prevHeight = height;
    }
  });

  resizeObserver.observe(container);
}
