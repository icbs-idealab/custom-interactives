export function initiateAutoResize() {
  const container = document.querySelector('#root'); // Or any top-level container
  let prevHeight = 0;

  const resizeObserver = new ResizeObserver(() => {
    let height = container.scrollHeight;

    // Add an extra 20px if the height is less than a threshold (e.g., 100px)
    const minHeightThreshold = 100; // Define a threshold for small apps
    const extraPadding = 30; // Extra padding for small apps
    if (height < minHeightThreshold) {
      height += extraPadding;
    }

    // Always send a message if the height changes (either increase or decrease)
    if (height !== prevHeight) {
      console.log("Sending resize message with height:", height);

      window.parent.postMessage(
        {
          height: height,
          source: "insendi-activity-resize",
        },
        "*"
      );

      prevHeight = height; // Update the previous height
    }
  });

  resizeObserver.observe(container);

  // Ensure initial height is sent
  const initialHeight = container.scrollHeight < minHeightThreshold 
    ? container.scrollHeight + extraPadding 
    : container.scrollHeight;

  window.parent.postMessage(
    {
      height: initialHeight,
      source: "insendi-activity-resize",
    },
    "*"
  );
  prevHeight = initialHeight;
}
