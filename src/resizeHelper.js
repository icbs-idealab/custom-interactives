export function initiateAutoResize() {
  const container = document.querySelector('#root'); // Or any top-level container
  let prevHeight = 0;

  const resizeObserver = new ResizeObserver(() => {
    let height = container.scrollHeight;

    // Add an extra 20px if the height is less than a threshold (e.g., 100px)
    const minHeightThreshold = 100; // Define a threshold for small apps
    const extraPadding = 20; // Extra padding for small apps
    if (height < minHeightThreshold) {
      height += extraPadding;
    }

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
