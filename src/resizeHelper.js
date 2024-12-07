let resizeObserver;

export function initiateAutoResize() {
  // Avoid setting up multiple observers
  if (resizeObserver) return;

  let prevHeight = 0;

  // Set up a ResizeObserver on the body element
  resizeObserver = new ResizeObserver(() => {
    const height = document.body.scrollHeight;

    // Only send a resize message if the height difference is greater than 5 pixels
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

  // Start observing the body element
  resizeObserver.observe(document.body);
}

export function disconnectAutoResize() {
  // Disconnect the observer when it's no longer needed
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
}
