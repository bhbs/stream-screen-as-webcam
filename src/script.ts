const DEVICE_ID = "screen-capture-as-webcam";

const isScreenCaptureSelected = (
  constraints?: MediaStreamConstraints
): boolean => {
  const video = constraints?.video;

  if (!video || video === true || !video.deviceId) return false;

  const deviceId = video.deviceId;

  if (Array.isArray(deviceId)) return deviceId.includes(DEVICE_ID);
  if (typeof deviceId === "string") return deviceId === DEVICE_ID;
  if (typeof deviceId === "object") return deviceId.exact === DEVICE_ID;

  return false;
};

const _getUserMedia = navigator.mediaDevices.getUserMedia.bind(
  navigator.mediaDevices
);

navigator.mediaDevices.getUserMedia = async (
  constraints?: MediaStreamConstraints
) => {
  return isScreenCaptureSelected(constraints)
    ? navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true,
      })
    : _getUserMedia(constraints);
};

const _enumerateDevices = navigator.mediaDevices.enumerateDevices.bind(
  navigator.mediaDevices
);

navigator.mediaDevices.enumerateDevices = async () => {
  const devices = await _enumerateDevices();

  const virtualDevice: MediaDeviceInfo = {
    groupId: "default",
    deviceId: DEVICE_ID,
    kind: "videoinput",
    label: "Screen Capture 🎬",
    toJSON: () => false,
  };

  return [...devices, virtualDevice];
};
