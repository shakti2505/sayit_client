import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface Props {
  // define your props here
}

const QrReader: React.FC<Props> = () => {
  // QR states
  const scanner = useRef<QrScanner>();
  const videEle = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState(true);

  // result
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  // sucess;
  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);
    setScannedResult(result?.data);
  };

  // Fail
  const onScanFail = (err: string | Error) => {
    console.log(err);
  };

  useEffect(() => {
    if (videEle.current && !scanner.current) {
      // instantiate the scanner
      scanner.current = new QrScanner(videEle?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // start QR scanner
      // 🚀 Start QR Scanner
      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // clean up on unmount
    return () => {
      if (!videEle.current) {
        scanner.current?.stop();
      }
    };
  }, []);

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);
  return (
    <div className="qr-reader">
      {/* QR */}
      <video ref={videEle}></video>
      <div ref={qrBoxEl} className="qr-box">
        {!videEle?.current && (
          <img
            src="/static/images/icons/scan_qr1.svg"
            alt="Qr Frame"
            width={256}
            height={256}
            className="qr-frame"
          />
        )}
      </div>

      {/* Show Data Result if scan is success */}
      {scannedResult && (
        <p
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 99999,
            color: "white",
          }}
        >
          Scanned Result: {scannedResult}
        </p>
      )}
    </div>
  );
};

export default QrReader;
